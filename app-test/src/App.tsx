import { useState } from "react";
import NavBar from "./Navbar";
import LiquidFillGauge from "./LiquidFillGauge";
import CaffeineIntakeModal from "./CaffeineIntakeModal";
import { Plus } from "lucide-react";

function App() {
	const [caffeineIntake, setCaffeineIntake] = useState(800);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const safetyLimit = 400;

	const handleAddCaffeine = (amount: number) => {
		setCaffeineIntake((current) => current + amount);
	};

	return (
		<>
			<div className="flex flex-row w-full h-full">
				<NavBar />
				<LiquidFillGauge caffeineIntake={caffeineIntake} safetyLimit={safetyLimit} />

				<button
					onClick={() => setIsModalOpen(true)}
					className="fixed bottom-8 right-8 bg-coffee-white text-coffee-md-brown rounded-lg w-14 h-14 flex items-center justify-center shadow-2xl"
				>
					<Plus className="w-6 h-6" />
				</button>

				{isModalOpen && (
					<CaffeineIntakeModal 
						onAddCaffeine={handleAddCaffeine}
						onClose={() => setIsModalOpen(false)}
					/>
				)}
			</div>
		</>
	);
}

export default App;