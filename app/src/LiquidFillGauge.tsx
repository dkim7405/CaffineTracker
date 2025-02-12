function LiquidFillGauge(
    { caffeineIntake, chartMax } : { caffeineIntake: number; chartMax: number }
) {
    // Constants for our gauge
    const color = "#2563eb"; // A blue color

    // Calculate the fill percentage based on caffeine intake
    const percentage = Math.min(100, Math.max(0, (caffeineIntake / chartMax) * 100));

    return (
        <div className="flex flex-col flex-grow items-center">
            {/* The gauge container */}
            <div className="relative w-full h-full">
                {/* Background container */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white overflow-hidden">
                    {/* Fill level, moving up as intake increases */}
                    <div
                        className="absolute bottom-0 w-full transition-transform duration-500"
                        style={{
                            height: '100%',
                            transform: `translateY(${100 - percentage}%)`,
                            backgroundColor: color,
                            opacity: 0.8
                        }}
                    />
                </div>

                {/* Display the current percentage in the center */}
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{Math.round(percentage)}%</span>
                </div>
            </div>
        </div>
    );
}

export default LiquidFillGauge;
