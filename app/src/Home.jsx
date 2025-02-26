// Home.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import PropTypes from 'prop-types';

import GaugeChart from './GaugeChart.jsx';
import CaffeineIntakeModal from './CaffeineIntakeModal.jsx';

function getTimeNow() {
	const now = new Date();
	const dateStr = now.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
	const timeStr = now.toLocaleTimeString('en-US', {
		hour12: false
	});

	return { dateStr, timeStr };
}

function HomePage({ drinksDB, userInfoManager }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [caffeineIntake, setCaffeineIntake] = useState(0);
	const [safetyLimit, setSafetyLimit] = useState(400);

	// Load todayIntake from Firestore
	useEffect(() => {
		if (!userInfoManager) return;

		const loadFromFirestore = async () => {
			try {
				await userInfoManager.reloadUserData();

				const data = userInfoManager.getUserData();
				const safetyLimit = await userInfoManager.getSafetyLimit();

				setCaffeineIntake(data.todayIntake);
				setSafetyLimit(safetyLimit);
			} catch (err) {
				console.error('Failed to load user data in Home:', err);
			}
		};

		loadFromFirestore();
	}, [userInfoManager]);

	const handleAddCaffeine = async (amount, drinkName) => {
		if (!userInfoManager) return;
		try {
			const { dateStr, timeStr } = getTimeNow();
			await userInfoManager.addCaffeineEntry(amount, drinkName, dateStr, timeStr);
			await userInfoManager.reloadUserData();

			const data = userInfoManager.getUserData();
			setCaffeineIntake(data.todayIntake);

			console.log('Caffeine added & Firestore updated');
		} catch (err) {
			console.error('Error adding caffeine:', err);
		}
	};

	return (
		<>
			<GaugeChart
				caffeineIntake={caffeineIntake}
				safetyLimit={safetyLimit}
			/>

			<button
				onClick={() => setIsModalOpen(true)}
				className="fixed bottom-8 right-8 bg-white text-coffee-dark rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:w-15 hover:h-15 transition-all duration-300 border-2 border-coffee-dark"
			>
				<Plus className="w-6 h-6" />
			</button>

			{isModalOpen && (
				<CaffeineIntakeModal
					onAddCaffeine={handleAddCaffeine}
					onClose={() => setIsModalOpen(false)}
					drinks={drinksDB}
				/>
			)}
		</>
	);
}
HomePage.propTypes = {
	drinksDB: PropTypes.array,
	userInfoManager: PropTypes.object
};

export default HomePage;
