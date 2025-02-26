import { useState } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

function DrinkInfoModal({ drink, onClose }) {
    const [unit, setUnit] = useState('oz');
    const [amount, setAmount] = useState('');

    const parsedAmount = parseFloat(amount) || 0;

    // Calculate total caffeine (mg) based on conversion:
    // If unit is 'oz', total caffeine = mg_per_oz * amount
    // If unit is 'ml', convert ml to oz, then mg = mg_per_oz * (ml / 29.5735)
    const totalMg =
        unit === 'oz'
            ? drink.mg_per_oz * parsedAmount
            : drink.mg_per_oz * (parsedAmount / 29.5735);

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-20"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 overflow-hidden relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-coffee-dark rounded-t-lg p-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-white/60"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-white">
                        {drink.name}
                    </h2>
                </div>

                <div className="flex flex-row p-4">
                    <img
                        src={`${drink.image}.jpg`}
                        alt={drink.name}
                        className="28 h-64 object-cover"
                        onError={(e) => {
                            e.target.src = '/placeholder-drink.png';
                        }}
                    />
                    <div className="flex flex-grow flex-col ml-6 justify-around">
                        <div className="flex flex-row mb-2 text-md text-coffee-dark justify-between">
                            <p className="font-semibold">Calories (cal):</p>
                            <p>{drink.calories} cal</p>
                        </div>
                        <div className="flex flex-row mb-2 text-md text-coffee-dark justify-between">
                            <p className="font-semibold">Size (ml):</p>
                            <p>{drink.size_ml} ml</p>
                        </div>
                        <div className="flex flex-row mb-2 text-md text-coffee-dark justify-between">
                            <p className="font-semibold">Size (oz):</p>
                            <p>{drink.size_oz} oz</p>
                        </div>
                        <div className="flex flex-row mb-2 text-md text-coffee-dark justify-between">
                            <p className="font-semibold">Caffeine (mg):</p>
                            <p>{drink.caffeine_mg} mg</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="amount"
                            className="font-semibold text-coffee-dark"
                        >
                            Amount:
                        </label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={`Enter amount in ${unit}`}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-dark transition-colors duration-300"
                        />

                        <div className="relative inline-flex w-32 bg-coffee-dark/20 rounded-full">
                            <div
                                className={`absolute top-0 left-0 h-full w-1/2 bg-coffee-dark rounded-full transition-transform duration-300 ${unit === 'oz' ? 'translate-x-full' : ''
                                    }`}
                            ></div>
                            <button
                                onClick={() => setUnit('ml')}
                                className={`flex-1 relative z-10 py-2 text-sm font-semibold ${unit === 'ml'
                                        ? 'text-white'
                                        : 'text-coffee-dark'
                                    }`}
                            >
                                ml
                            </button>
                            <button
                                onClick={() => setUnit('oz')}
                                className={`flex-1 relative z-10 py-2 text-sm font-semibold ${unit === 'oz'
                                        ? 'text-white'
                                        : 'text-coffee-dark'
                                    }`}
                            >
                                oz
                            </button>
                        </div>
                    </div>
                    <div className="text-coffee-dark font-semibold">
                        Total Caffeine: {totalMg.toFixed(2)} mg
                    </div>
                </div>
            </div>
        </div>
    );
}
DrinkInfoModal.propTypes = {
    drink: PropTypes.object,
    onClose: PropTypes.func,
};

export default DrinkInfoModal;
