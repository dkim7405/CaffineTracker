// App.jsx
import { useEffect, useState } from 'react';
import { House, Logs, Search, UserRound } from 'lucide-react';

import SideNavigator from './SideNavigator.jsx';
import HomePage from './Home.jsx';
import SearchPage from './Search.jsx';
import HistoryPage from './History.jsx';
import ProfilePage from './Profile.jsx';

import CaffeineDrinksDBManager from './CaffeineDrinksDBManager';
import UserInfoManager from './UserInfoManager.jsx';

import './App.css';

function App() {
	const [drinksDB, setDrinksDB] = useState([]);
	const [activePage, setActivePage] = useState('Home');

	const [userInfoManager, setUserInfoManager] = useState(null);
	const [loginStatus, setLoginStatus] = useState('');

	const pages = {
		home: { name: 'Home', icon: <House className="w-5 h-5" /> },
		search: { name: 'Search', icon: <Search className="w-5 h-5" /> },
		history: { name: 'History', icon: <Logs className="w-5 h-5" /> },
		profile: { name: 'Profile', icon: <UserRound className="w-5 h-5" /> }
	};

	const renderPage = () => {
		switch (activePage) {
			case pages.home.name:
				return (
					<HomePage drinksDB={drinksDB} userInfoManager={userInfoManager} />
				);
			case pages.search.name:
				return <SearchPage drinksDB={drinksDB} />;
			case pages.history.name:
				return <HistoryPage userInfoManager={userInfoManager} />;
			case pages.profile.name:
				return <ProfilePage userInfoManager={userInfoManager} />;
			default:
				return (
					<HomePage
						drinksDB={drinksDB}
						userInfoManager={userInfoManager}
					/>
				);
		}
	};

	// Fetch drinks database
	useEffect(() => {
		const drinksDBManager = new CaffeineDrinksDBManager();
		setDrinksDB(drinksDBManager.drinksDB);
	}, []);

	useEffect(() => {
		async function doLogin() {
			const userInfoManager = new UserInfoManager('kimd7', 'password');
			const loggedIn = await userInfoManager.login();

			if (loggedIn) {
				setUserInfoManager(userInfoManager);
				setLoginStatus('Logged in successfully');
			} else {
				setLoginStatus('Login failed');
			}
		}

		doLogin();
	}, []);

	return (
		<>
			{!userInfoManager && (
				<div className="p-4 text-red-600">
					{loginStatus || 'Attempting to log in...'}
				</div>
			)}

			{userInfoManager && (
				<div className="flex flex-row">
					<SideNavigator
						pages={pages}
						activePage={activePage}
						setNavActivePage={(page) => setActivePage(page)}
					/>
					{renderPage()}
				</div>
			)}
		</>
	);
}

export default App;
