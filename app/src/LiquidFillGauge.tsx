import React, { useMemo } from 'react';

type LiquidFillGaugeProps = {
    caffeineIntake: number;
    safetyLimit: number;
};

// Helper function to compute the effective chart maximum
function getEffectiveChartMax(caffeineIntake: number, safetyLimit: number): number {
    // When caffeine is below safetyLimit, the max is safetyLimit + 50
    if (caffeineIntake < safetyLimit) {
        return safetyLimit + 50;
    }
    let chartMax = safetyLimit + 50;
    let count = 0;
    // Increase the chart maximum every time the caffeine intake reaches (chartMax - 50)
    while (caffeineIntake >= chartMax - 50) {
        count++;
        chartMax = safetyLimit * (count + 1);
    }
    return chartMax;
}

// Helper function to generate markers based on the chart maximum and increment size
function generateMarkers(
    chartMax: number,
    incrementSize: number
): { value: number; position: number }[] {
    const markers = [];
    for (let value = chartMax; value >= 0; value -= incrementSize) {
        markers.push({
            value,
            position: ((chartMax - value) / chartMax) * 100,
        });
    }
    // Ensure 0 is always included
    if (markers[markers.length - 1]?.value !== 0) {
        markers.push({ value: 0, position: 100 });
    }
    return markers;
}

const LiquidFillGauge: React.FC<LiquidFillGaugeProps> = ({ caffeineIntake, safetyLimit }) => {
    const color = "#2563eb"; // A blue color
    // The scale threshold is now directly tied to safetyLimit
    const scaleThreshold = safetyLimit;

    // Calculate the effective maximum for the gauge using a memoized helper
    const effectiveChartMax = useMemo(
        () => getEffectiveChartMax(caffeineIntake, safetyLimit),
        [caffeineIntake, safetyLimit]
    );

    // Calculate the fill percentage based on the effective maximum
    const percentage = Math.min(
        100,
        Math.max(0, (caffeineIntake / effectiveChartMax) * 100)
    );

    // Determine the marker increment size based on the caffeine intake
    const incrementSize = caffeineIntake > scaleThreshold ? 100 : 50;

    // Generate markers using a memoized helper
    const markers = useMemo(
        () => generateMarkers(effectiveChartMax, incrementSize),
        [effectiveChartMax, incrementSize]
    );

    return (
        <div className="flex flex-col flex-grow items-center">
            {/* Gauge container */}
            <div className="relative w-full h-full">
                {/* Background container */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white overflow-hidden">
                    {/* Increment markers */}
                    <div className="absolute top-0 left-0 h-full z-10">
                        {markers.map((marker) => (
                            <div
                                key={marker.value}
                                className="absolute left-4 flex items-center"
                                style={{ top: `${marker.position}%` }}
                            >
                                <span className="text-sm text-black font-medium">
                                    {marker.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Fill level */}
                    <div
                        className="absolute bottom-0 w-full transition-transform duration-500"
                        style={{
                            height: "100%",
                            transform: `translateY(${100 - percentage}%)`,
                            backgroundColor: color,
                            opacity: 0.8,
                        }}
                    />
                </div>

                {/* Center percentage display */}
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{Math.round(percentage)}%</span>
                </div>
            </div>
        </div>
    );
};

export default LiquidFillGauge;
