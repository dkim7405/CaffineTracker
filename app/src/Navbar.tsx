import { useState } from 'react';
import { House, Logs, Search, UserRound } from 'lucide-react';

function NavBar() {
    const [activeTab, setActiveTab] = useState('floz');
    const [activeItem, setActiveItem] = useState('Home');

    const navItems = [
        { name: 'Home', icon: <House className="w-5 h-5" /> },
        { name: 'Search', icon: <Search className="w-5 h-5" /> },
        { name: 'History', icon: <Logs className="w-5 h-5" /> },
        { name: 'Profile', icon: <UserRound className="w-5 h-5" /> }
    ];

    return (
        <div className="w-64 h-screen bg-white p-4 flex flex-col shadow-2xl z-50">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-6">
                <h1 className="text-lg font-medium text-gray-500">
                    Good Morning, Leo
                </h1>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab === 'floz'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500'
                        }`}
                    onClick={() => setActiveTab('floz')}
                >
                    fl oz
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab === 'ml'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500'
                        }`}
                    onClick={() => setActiveTab('ml')}
                >
                    ml
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${activeItem === item.name
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveItem(item.name)}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default NavBar;