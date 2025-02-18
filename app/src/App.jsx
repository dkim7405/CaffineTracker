import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import './App.css';
import GaugeChart from './GaugeChart.jsx';
import SideNavigator from './SideNavigator.jsx';
import CaffeineIntakeModal from './CaffeineIntakeModal.jsx';

import CaffeineDrinksDBManager from './CaffeineDrinksDBManager.jsx';

function App() {
	const [drinksDB, setDrinksDB] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Store caffeine intake in state
	const [caffeineIntake, setCaffeineIntake] = useState(200);
	const safetyLimit = 400;

	useEffect(() => {
		const drinksDBManager = new CaffeineDrinksDBManager();
		setDrinksDB(drinksDBManager.drinksDB);
	}, []);


	const handleAddCaffeine = (amount) => {
		console.log("Adding caffeine:", amount);
		setCaffeineIntake(prev => prev + amount);
	};

	return (
		<div className="flex flex-row">
			<SideNavigator />

			<GaugeChart caffeineIntake={caffeineIntake} safetyLimit={safetyLimit} />

			<button
				onClick={() => setIsModalOpen(true)}
				className="fixed bottom-8 right-8 bg-white text-coffee-dark rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:w-15 hover:h-15 transition-all duration-300"
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
		</div>
	);
}

export default App;
