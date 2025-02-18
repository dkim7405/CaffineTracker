// GaugeChart.jsx
import PropTypes from 'prop-types';

const fillColor = '#3d2c2c';

function GaugeChart({ caffeineIntake, safetyLimit }) {

    const getChartMax = () => {
        let initialMax = safetyLimit + 50;
        let returnMax = initialMax;
        if (caffeineIntake >= safetyLimit) {
            let count = 0;
            while (caffeineIntake >= returnMax - 50) {
                count++;
                returnMax = safetyLimit * (count + 1);
            }
        }
        return returnMax;
    };

    const chartMax = getChartMax();

    const getStepSize = () => {
        let stepsize = 50;
        if (caffeineIntake > safetyLimit) {
            stepsize = chartMax / 8;
        }
        // Round to the nearest 50
        return Math.round(stepsize / 50) * 50;
    };

    const step = getStepSize();

    const markers = [];
    for (let i = 0; i <= chartMax; i += step) {
        markers.push({
            value: i,
            position: (i / chartMax) * 100,
        });
    }

    const percentage = Math.min(100, Math.max(0, (caffeineIntake / chartMax) * 100));

    const renderMarkers = () => (
        <div className="absolute top-4 left-4 h-full z-1">
            {markers.map((marker) => {
                const isInsideFill = marker.position >= percentage + 1;
                const textColor = isInsideFill ? "text-coffee-dark" : "text-white";
                return (
                    <div
                        key={marker.value}
                        className="absolute flex items-center"
                        style={{ top: `${100 - marker.position}%` }}
                    >
                        <span className={`text-md ${textColor} font-medium`}>
                            {marker.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    const renderFill = () => (
        <div
            className="absolute bottom-0 w-full shadow-2xl transition-transform duration-500"
            style={{
                height: "100%",
                transform: `translateY(${102 - percentage}%)`,
                backgroundColor: fillColor,
                opacity: 1,
            }}
        />
    );

    const renderIntake = () => (
        <div
            className="absolute right-10 flex items-center justify-end transition-all text-white duration-500"
            style={{
                top: `${100 - percentage}%`,
                transform: 'translateY(100%)',
            }}
        >
            <span className="text-3xl font-bold">{caffeineIntake}</span>
            <span className="pt-1 pl-1 text-lg font-medium">mg</span>
        </div>
    );

    return (
        <div className="flex flex-col flex-grow items-center">
            <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                    {renderMarkers()}
                    {renderFill()}
                </div>
                {renderIntake()}
            </div>
        </div>
    );
}
GaugeChart.propTypes = {
    caffeineIntake: PropTypes.number,
    safetyLimit: PropTypes.number,
};

export default GaugeChart;
