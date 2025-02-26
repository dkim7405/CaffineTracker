// CaffeineIntakeModal.jsx
import { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import PropTypes from 'prop-types';

import './index.css';

function CaffeineIntakeModal({ onAddCaffeine, onClose, drinks }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [customAmount, setCustomAmount] = useState('');

    const hasCustomAmount = customAmount.trim() !== '';
    const isCustomAmountValid = !hasCustomAmount || /^[0-9]*$/.test(customAmount.trim());
    const hasDrink = selectedDrink !== null;
    const isAddDisabled = (!hasDrink && !hasCustomAmount) || (hasDrink && hasCustomAmount) || !isCustomAmountValid;

    let addButtonText = 'Select a Drink or Enter Amount';
    if (hasCustomAmount && !hasDrink && isCustomAmountValid) { addButtonText = `Add ${customAmount.trim()} mg`; }
    else if (hasCustomAmount && !hasDrink && !isCustomAmountValid) { addButtonText = 'Only integer amount allowed'; }
    else if (hasDrink && !hasCustomAmount) { addButtonText = `Add ${selectedDrink.name}`; }
    else if (hasDrink && hasCustomAmount) { addButtonText = 'You can only add amount OR a drink'; }

    // Fuzzy search logic
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredDrinks(drinks);
        } else {
            const term = searchTerm.toLowerCase();
            const termNoSpace = term.replace(/\s/g, '');

            const filtered = drinks.filter((d) => {
                const drinkName = d.name.toLowerCase();
                const drinkNameNoSpace = drinkName.replace(/\s/g, '');
                return (
                    drinkName.includes(term) ||
                    drinkNameNoSpace.includes(termNoSpace)
                );
            });
            
            setFilteredDrinks(filtered);
        }
    }, [searchTerm, drinks]);

    const handleSelectDrink = (drink) => {
        if (selectedDrink?.name === drink.name) {
            setSelectedDrink(null);
        } else {
            setSelectedDrink(drink);
        }
    };

    const handleAdd = () => {
        if (hasDrink && hasCustomAmount) {
            return;
        }

        if (hasCustomAmount && !hasDrink) {
            const customMg = parseInt(customAmount, 10);
            onAddCaffeine(customMg, 'Custom Amount');
        }
        else if (hasDrink && !hasCustomAmount) {
            onAddCaffeine(selectedDrink.caffeine_mg, selectedDrink.name);
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex flex-col bg-coffee-dark relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-white/60"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-white">Add Caffeine</h2>
                    </div>

                    <div className="pt-2 pb-4 px-4">
                        <div className="flex items-center bg-coffee-dark/30 px-2">
                            <Plus className="w-5 h-5 text-white" />
                            <input
                                type="number"
                                placeholder="Add Amount"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="w-full ml-2 text-white focus:outline-none bg-transparent"
                            />
                            <span className="text-white">mg</span>
                        </div>
                    </div>

                    <span className="w-full text-center text-white">or</span>

                    {/* Search bar */}
                    <div className="pt-4 pb-4 px-4">
                        <div className="flex items-center bg-coffee-dark/30 px-2">
                            <Search className="w-5 h-5 text-white" />
                            <input
                                type="text"
                                placeholder="Search drinks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full ml-2 text-white focus:outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Drink List */}
                <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                    {filteredDrinks.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No drinks found</p>
                    ) : (
                        filteredDrinks.map((d) => {
                            const isSelected = selectedDrink?.name === d.name;
                            return (
                                <div
                                    key={d.name}
                                    className={`p-4 flex items-start cursor-pointer rounded-lg mb-2 hover:bg-coffee-dark/5 ${isSelected ? 'bg-coffee-dark/10 border border-coffee-dark' : ''
                                        }`}
                                    onClick={() => handleSelectDrink(d)}
                                >
                                    <DrinkItem drink={d} />
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Add Button */}
                <div className="p-4">
                    <button
                        onClick={handleAdd}
                        disabled={isAddDisabled}
                        className={`w-full py-3 text-white rounded-lg flex items-center justify-center ${!isAddDisabled
                                ? 'bg-coffee-dark/90 hover:bg-coffee-dark'
                                : 'bg-coffee-dark/60 cursor-not-allowed'
                            }`}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span>{addButtonText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
CaffeineIntakeModal.propTypes = {
    onAddCaffeine: PropTypes.func,
    onClose: PropTypes.func,
    drinks: PropTypes.array
};

// Renders a single drink item
function DrinkItem({ drink }) {
    return (
        <div className="flex flex-row">
            <div className="w-6 h-12 bg-gray-200 rounded-md overflow-hidden m-2">
                <img
                    src={`/${drink.image}.jpg`}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = '/placeholder-drink.png')}
                />
            </div>
            <div className="flex flex-col flex-grow ml-2 justify-center">
                <h3 className="font-medium text-coffee-dark">{drink.name}</h3>
                <div className="flex text-sm text-gray-500 mt-1">
                    <span className="mr-3">{drink.caffeine_mg} mg</span>
                    <span className="mr-3">
                        {drink.size_oz} oz / {drink.size_ml} ml
                    </span>
                </div>
            </div>
        </div>
    );
}
DrinkItem.propTypes = {
    drink: PropTypes.object
};

export default CaffeineIntakeModal;
