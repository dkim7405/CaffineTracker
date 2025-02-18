function LiquidFillGauge({
    caffeineIntake,
    safetyLimit,
}: {
    caffeineIntake: number;
    safetyLimit: number;
}) {
    // The color of the fill.
    const fillColor = "#3d2c2c";
    // Get the best maximum value for the gauge.
    const effectiveChartMax = getChartMax(caffeineIntake, safetyLimit);
    // 100 if caffeine is above the safety limit; otherwise, 50.
    const step = caffeineIntake > safetyLimit ? 100 : 50;
    // Chart markers.
    const markers = generateMarkers(effectiveChartMax, step);
    // Calculate the fill percentage (0% to 100%).
    const percentage = Math.min(
        100,
        Math.max(0, (caffeineIntake / effectiveChartMax) * 100)
    );

    return (
        <div className="flex flex-col flex-grow items-center">
            {/* Main gauge container */}
            <div className="relative w-full h-full">
                {/* Background and markers container */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white overflow-hidden">
                    {/* Marker labels on the left */}
                    <div className="absolute top-5 left-4 h-full z-10">
                        {markers.map((marker) => (
                            <div
                                key={marker.value}
                                className="absolute flex items-center"
                                style={{ top: `${marker.position}%` }}
                            >
                                <span className="text-sm text-white font-medium">
                                    {marker.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* The fill level of the gauge */}
                    <div
                        className="absolute bottom-0 w-full transition-transform duration-500"
                        style={{
                            height: "100%",
                            transform: `translateY(${103 - percentage}%)`,
                            backgroundColor: fillColor,
                            opacity: 1,
                        }}
                    />
                </div>

                {/* Total Caffeine Intake that moves with the fill */}
                <div
                    className="absolute right-10 flex items-center justify-end transition-all text-white duration-500"
                    style={{
                        // Position the text at the top edge of the fill.
                        top: `${100 - percentage}%`,
                        transform: 'translateY(100%)'
                    }}
                >
                    <span className="text-3xl font-bold">{caffeineIntake}</span>
                    <span className="pt-1 pl-1 text-lg font-medium">mg</span>
                </div>
            </div>
        </div>
    );
}

// HELPER FUNCTIONS

function generateMarkers(chartMax: number, step: number) {
    const markers = [];

    for (let value = chartMax; value >= 0; value -= step) {
        markers.push({
            value,
            position: ((chartMax - value) / chartMax) * 100,
        });
    }

    // Add a marker for 0 if it's not already there.
    if (markers[markers.length - 1].value !== 0) {
        markers.push({
            value: 0,
            position: 100,
        });
    }

    return markers;
}

function getChartMax(caffeineIntake: number, safetyLimit: number) {
    let chartMax = safetyLimit + 50;

    if (caffeineIntake < safetyLimit) {
        return chartMax;
    } else {
        let count = 0;
        while (caffeineIntake >= chartMax - 50) {
            count++;
            chartMax = safetyLimit * (count + 1);
        }
        return chartMax;
    }
}

export default LiquidFillGauge;
