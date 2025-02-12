import NavBar from "./Navbar";
import LiquidFillGauge from "./LiquidFillGauge";

function App() {
	return (
		<>
			<div className="flex flex-row w-full h-full">
				<NavBar />
				<LiquidFillGauge caffeineIntake={200} chartMax={400} />
			</div>
		</>
	);
};

export default App;
