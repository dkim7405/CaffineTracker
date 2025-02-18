import { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import PropTypes from 'prop-types';

import './index.css'

function CaffeineIntakeModal({ onAddCaffeine, onClose, drinks }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);

    // Fuzzy Search
    // Every time the search term or drinks list changes
    useEffect(() => {
        // if no search --> show all drinks
        if (!searchTerm.trim()) {
            setFilteredDrinks(drinks);
        }
        // contains filter
        else {
            let term = searchTerm.toLowerCase();
            let termWithoutSpaces = term.replace(/\s/g, '');

            let filteredDrinks = [];

            drinks.forEach(drink => {
                let drinkName = drink.name.toLowerCase();
                let drinkNameWithoutSpaces = drinkName.replace(/\s/g, '');

                if (drinkName.includes(term) || drinkNameWithoutSpaces.includes(termWithoutSpaces)) {
                    filteredDrinks.push(drink);
                }
            });

            setFilteredDrinks(filteredDrinks);
        }
    }, [searchTerm, drinks]);

    const handleSelectDrink = (drink) => setSelectedDrink(drink);

    const handleAddCaffeine = () => {
        if (selectedDrink) {
            onAddCaffeine(selectedDrink.caffeine_mg);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-2" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-coffee-dark">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-white/60"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-white">Add Drinks</h2>
                    </div>

                    <div className="pt-2 pb-4 pr-4 pl-4">
                        <div className="flex items-center">
                            <Search className="w-5 h-5 text-white" />
                            <input
                                type="text"
                                placeholder="Search drinks..."
                                value={ searchTerm }
                                onChange={ (element) => setSearchTerm(element.target.value) }
                                className="w-full ml-2 text-white focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {renderDrinkList(filteredDrinks, selectedDrink, handleSelectDrink)}

                <div className="p-4">
                    <button
                        onClick={handleAddCaffeine}
                        disabled={!selectedDrink}
                        className={`w-full py-3 ${selectedDrink ? 'bg-coffee-dark/90 hover:bg-coffee-dark' : 'bg-coffee-dark/60 cursor-not-allowed'} text-white rounded-lg flex items-center justify-center`}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span>{selectedDrink ? `Add ${selectedDrink.name}` : 'SELECT A DRINK'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const renderDrinkList = (filteredDrinks, selectedDrink, handleSelectDrink) => (
    <div className="max-h-70 overflow-y-auto p-2 custom-scrollbar">
        {
            filteredDrinks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No drinks found</p>
            ) : (
                filteredDrinks.map((drink) => (
                    <div
                        key={drink.name}
                        className={`p-3 flex items-start cursor-pointer rounded-lg mb-2 hover:bg-coffee-dark/5 ${selectedDrink?.name === drink.name ? 'bg-coffee-dark/10 border border-coffee-dark' : ''}`}
                        onClick={() => handleSelectDrink(drink)}
                    >
                        {renderDrinkItem(drink)}
                    </div>
                ))
            )
        }
    </div>
);

const renderDrinkItem = (drink) => (
    <>
        <div className="flex flex-row">
            <div className="w-6 h-12 bg-gray-200 rounded-md overflow-hidden m-2">
                <img
                    src={ `/${drink.image}.jpg` }
                    alt={drink.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/placeholder-drink.png'}
                />
            </div>
            <div className="flex flex-col flex-grow ml-2 justify-center">
                <h3 className="font-medium text-coffee-dark">{drink.name}</h3>
                <div className="flex text-sm text-gray-500 mt-1">
                    <span className="mr-3">{drink.caffeine_mg} mg</span>
                    <span className="mr-3">{drink.size_oz} oz / {drink.size_ml} ml</span>
                </div>
            </div>
        </div>
    </>
);

CaffeineIntakeModal.propTypes = {
    onAddCaffeine: PropTypes.func,
    onClose: PropTypes.func,
    drinks: PropTypes.array
};

export default CaffeineIntakeModal;
