import PropTypes from 'prop-types';

function SideNavigator({ pages, activePage, setNavActivePage }) {
    // Convert pages object to array
    const navPages = Object.values(pages);

    return (
        <div className="max-w-38 h-screen bg-white p-4 flex flex-col shadow-2xl z-1">
            {/* Navigation Items */}
            <nav className="space-y-2 flex flex-col flex-grow justify-around">
                {navPages.map((page) => (
                    <button
                        key={page.name}
                        className={`flex items-center w-full px-2 rounded-lg ${activePage === page.name
                                ? 'text-coffee-dark text-lg'
                                : 'text-coffee-dark opacity-60 hover:text-lg duration-200'
                            }`}
                        onClick={() => setNavActivePage(page.name)}
                    >
                        {page.icon}
                        <span className="hidden md:inline font-medium ml-3">{page.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
SideNavigator.propTypes = {
    pages: PropTypes.object,
    activePage: PropTypes.string,
    setNavActivePage: PropTypes.func
};

export default SideNavigator;