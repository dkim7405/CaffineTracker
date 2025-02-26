import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import DrinkInfoModal from './DrinkInfoModal';

function SearchPage({ drinksDB }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);

    // Fuzzy Search
    useEffect(() => {
        // If no search --> show all drinks
        if (!searchTerm.trim()) {
            setFilteredDrinks(drinksDB);
        } else {
            const term = searchTerm.toLowerCase().replace(/\s/g, '');
            const results = drinksDB.filter((drink) => {
                const nameNoSpace = drink.name.toLowerCase().replace(/\s/g, '');
                return nameNoSpace.includes(term);
            });
            setFilteredDrinks(results);
        }
    }, [searchTerm, drinksDB]);

    // When user clicks on a drink, open the modal
    const handleSelectDrink = (drink) => {
        setSelectedDrink(drink);
    };

    // Close the modal
    const handleCloseModal = () => {
        setSelectedDrink(null);
    };

    return (
        <>
            <div className="w-full h-screen flex flex-col">
                <div className="bg-coffee-dark pt-4 pb-8 pl-4 pr-4 shadow-xl">
                    <h1 className="text-2xl text-white mb-8">Drinks Database</h1>

                    <div className="flex items-center">
                        <Search className="w-5 h-5 text-white" />
                        <input
                            type="text"
                            placeholder="Search for a drink..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full ml-2 text-white focus:outline-none"
                        />
                    </div>
                </div>

                {/* Display filtered drinks */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {
                        filteredDrinks.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No drinks found</p>
                        ) : (
                            filteredDrinks.map((drink) => (
                                <div
                                    key={drink.name}
                                    className={`p-4 flex items-start cursor-pointer rounded-lg mb-2 hover:bg-coffee-dark/5 ${selectedDrink?.name === drink.name ? 'bg-coffee-dark/10 border border-coffee-dark' : ''}`}
                                    onClick={() => handleSelectDrink(drink)}
                                >
                                    {renderDrinkItem(drink)}
                                </div>
                            ))
                        )
                    }
                </div>

                {/* Drink Info Modal */}
                {selectedDrink && (
                    <DrinkInfoModal
                        drink={selectedDrink}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </>
    );
}
SearchPage.propTypes = {
    drinksDB: PropTypes.array,
};

const renderDrinkItem = (drink) => (
    <>
        <div className="flex flex-row">
            <div className="w-6 h-12 bg-gray-200 rounded-md overflow-hidden m-2">
                <img
                    src={`/${drink.image}.jpg`}
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

export default SearchPage;
