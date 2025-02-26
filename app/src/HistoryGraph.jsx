// HistoryGraph.jsx
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function sumCaffeinePerDay(caffeineHistory) {
    const sumsByDate = {};

    for (const entry of caffeineHistory) {
        const { date, caffeine } = entry;

        if (!sumsByDate[date]) {
            sumsByDate[date] = 0;
        }
        sumsByDate[date] += caffeine;
    }

    // Sorted by date (ascending)
    return Object.entries(sumsByDate)
        .map(([date, totalCaffeine]) => ({ date, totalCaffeine }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function filterDailySumsByRange(dailySums, range) {
    if (!range) return dailySums;

    const now = new Date();
    let cutoff;

    switch (range) {
        case 'week':
            cutoff = new Date(now);
            cutoff.setDate(now.getDate() - 7);
            break;
        case 'month':
            cutoff = new Date(now);
            cutoff.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            cutoff = new Date(now);
            cutoff.setFullYear(now.getFullYear() - 1);
            break;
        default:
            return dailySums;
    }

    return dailySums.filter((item) => new Date(item.date) >= cutoff);
}

function HistoryGraph({ history = [] }) {
    const [range, setRange] = useState('week');

    const getChartData = () => {
        const dailySums = sumCaffeinePerDay(history);
        const filtered = filterDailySumsByRange(dailySums, range);

        const labels = filtered.map((item) => item.date);
        const data = filtered.map((item) => item.totalCaffeine);

        // Chart.js data object
        return {
            labels,
            datasets: [
                {
                    label: 'Caffeine (mg)',
                    data: data,
                    borderColor: '#3d2c2c',
                    backgroundColor: '#3d2c2c66',
                    tension: 0.2,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow">
            {/* Range selector */}
            <div className="mb-4 flex items-center">
                <div className="relative inline-flex w-48 bg-coffee-dark/20 rounded-full">
                    <div
                        className={`absolute top-0 left-0 h-full w-1/3 bg-coffee-dark rounded-full transition-transform duration-300
                            ${range === 'month' ? 'translate-x-full' : range === 'year' ? 'translate-x-[200%]' : ''}`}
                    />
                    <button
                        onClick={() => setRange('week')}
                        className={`flex-1 relative z-10 py-2 text-sm font-semibold ${range === 'week' ? 'text-white' : 'text-coffee-dark'
                            }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setRange('month')}
                        className={`flex-1 relative z-10 py-2 text-sm font-semibold ${range === 'month' ? 'text-white' : 'text-coffee-dark'
                            }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setRange('year')}
                        className={`flex-1 relative z-10 py-2 text-sm font-semibold ${range === 'year' ? 'text-white' : 'text-coffee-dark'
                            }`}
                    >
                        Year
                    </button>
                </div>
            </div>

            <div className="relative h-64 md:h-80">
                <Line data={getChartData()} options={chartOptions} />
            </div>
        </div>
    );
}
HistoryGraph.propTypes = {
    history: PropTypes.array,
};

export default HistoryGraph;