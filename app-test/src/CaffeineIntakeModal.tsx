import React, { useState } from 'react';
import { Plus, X, Coffee, Droplet, Coffee as TeaIcon, Milk, Beer } from 'lucide-react';

type BeverageType = 'Water' | 'Coffee' | 'Tea' | 'Milk' | 'Juice';

interface BeverageOption {
  type: BeverageType;
  icon: React.ReactNode;
  caffeinePerMl: number;
}

function CaffeineIntakeModal({ onAddCaffeine, onClose }: { 
  onAddCaffeine: (amount: number) => void; 
  onClose: () => void;
}) {
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageType>('Water');
  const [quantity, setQuantity] = useState<number>(250);
  
  const beverageOptions: BeverageOption[] = [
    { type: 'Water', icon: <Droplet className="w-5 h-5" />, caffeinePerMl: 0 },
    { type: 'Coffee', icon: <Coffee className="w-5 h-5" />, caffeinePerMl: 0.4 }, // ~100mg per 250ml
    { type: 'Tea', icon: <TeaIcon className="w-5 h-5" />, caffeinePerMl: 0.15 }, // ~40mg per 250ml
    { type: 'Milk', icon: <Milk className="w-5 h-5" />, caffeinePerMl: 0 },
    { type: 'Juice', icon: <Beer className="w-5 h-5" />, caffeinePerMl: 0 }
  ];

  const quantityOptions = [150, 200, 250, 300];

  const handleAddIntake = () => {
    const selectedOption = beverageOptions.find(b => b.type === selectedBeverage);
    if (selectedOption) {
      const caffeineAmount = Math.round(selectedOption.caffeinePerMl * quantity);
      onAddCaffeine(caffeineAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 overflow-hidden relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Blue wave header display showing current intake */}
        <div className="bg-blue-500 text-white p-6 pt-10 pb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-5xl font-bold">{quantity}</div>
            <div className="text-lg opacity-80">ml</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-blue-500 opacity-50"></div>
        </div>
        
        {/* Beverage selection */}
        <div className="flex overflow-x-auto p-4 space-x-2 border-b">
          {beverageOptions.map((beverage) => (
            <button
              key={beverage.type}
              onClick={() => setSelectedBeverage(beverage.type)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-16 ${
                selectedBeverage === beverage.type 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {beverage.icon}
              <span className="text-xs mt-1">{beverage.type}</span>
            </button>
          ))}
        </div>
        
        {/* Quantity selection */}
        <div className="p-4">
          <div className="flex justify-between space-x-2 mb-8">
            {quantityOptions.map((option) => (
              <button
                key={option}
                onClick={() => setQuantity(option)}
                className={`py-2 flex-1 border rounded-lg ${
                  quantity === option 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                {option} ml
              </button>
            ))}
          </div>
          
          {/* Current selection display */}
          <div className="text-center text-3xl font-bold text-blue-500 mb-8">
            {quantity} ml
          </div>
          
          {/* Add button */}
          <button
            onClick={handleAddIntake}
            className="w-full py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaffeineIntakeModal;