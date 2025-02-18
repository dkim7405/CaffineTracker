import { useState } from 'react';
import { House, Logs, Search, UserRound } from 'lucide-react';

function NavBar() {
    const [activeItem, setActiveItem] = useState('Home');

    const navItems = [
        { name: 'Home', icon: <House className="w-5 h-5" /> },
        { name: 'Search', icon: <Search className="w-5 h-5" /> },
        { name: 'History', icon: <Logs className="w-5 h-5" /> },
        { name: 'Profile', icon: <UserRound className="w-5 h-5" /> }
    ];

    return (
        <div className="w-38 h-screen bg-white p-4 flex flex-col shadow-2xl z-50">
            {/* Navigation Items */}
            <nav className="space-y-2 flex flex-col flex-grow justify-around">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${activeItem === item.name
                                ? 'text-coffee-500 text-lg'
                                : 'text-coffee-300 hover:text-lg duration-200'
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
}

export default NavBar;