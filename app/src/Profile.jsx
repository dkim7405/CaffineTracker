import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function ProfilePage({ userInfoManager }) {
    const [isLoading, setIsLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [weightLBS, setWeightLBS] = useState('');

    const loadData = async () => {
        try {
            // Reload from Firestore in case data changed
            await userInfoManager.reloadUserData();
            const data = userInfoManager.getUserData();

            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setUsername(data.username || '');
            setPassword(data.password || '');
            setWeightLBS(data.weightLBS || '');
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to load user data:', err);
        }
    };

    useEffect(() => {
        if (userInfoManager) {
            loadData();
        }
    }, [userInfoManager]);

    const handleSave = async () => {
        try {
            await userInfoManager.updateName(firstName, lastName);
            await userInfoManager.updateWeightLBS(weightLBS);
            await loadData();

            setEditing(false);
        } catch (err) {
            console.error('Failed to update user info:', err);
        }
    };

    const handleCancel = async () => {
        setEditing(false);
        await loadData();
    };

    if (!userInfoManager) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold">Profile</h2>
                <p className="text-red-500">No userInfoManager provided.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">Profile</h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col bg-white overflow-y-auto">
            <div className="bg-coffee-dark p-4 shadow text-white">
                <h1 className="text-2xl">Profile</h1>
            </div>

            <div className="p-4 flex-1 flex justify-center items-start">
                <div className="max-w-lg w-full bg-white rounded-lg shadow p-6 mt-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-coffee-dark">
                            Your Information
                        </h2>

                        {/* Show on screen and hidden on mobile */}
                        <div className="hidden md:flex space-x-4">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white transition-all duration-300"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white transition-all duration-300"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-md font-semibold text-coffee-dark mb-2">
                                First Name
                            </label>
                            {editing ? (
                                <input
                                    className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-coffee-dark focus:outline-none transition-all"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            ) : (
                                <p className="text-coffee-dark">{firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-md font-semibold text-coffee-dark mb-2">
                                Last Name
                            </label>
                            {editing ? (
                                <input
                                    className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-coffee-dark focus:outline-none transition-all"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            ) : (
                                <p className="text-coffee-dark">{lastName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-md font-semibold text-coffee-dark mb-2">
                                Weight (lbs)
                            </label>
                            {editing ? (
                                <input
                                    type="number"
                                    className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-coffee-dark focus:outline-none transition-all"
                                    value={weightLBS}
                                    onChange={(e) => setWeightLBS(e.target.value)}
                                />
                            ) : (
                                <p className="text-coffee-dark">{weightLBS}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-md font-semibold text-coffee-dark mb-2">
                                Username
                            </label>
                            <p className="text-coffee-dark opacity-80">{username}</p>
                        </div>

                        <div>
                            <label className="block text-md font-semibold text-coffee-dark mb-2">
                                Password
                            </label>
                            <p className="text-coffee-dark opacity-80">{password}</p>
                        </div>
                    </div>

                    {/* Show on mobile and hide on screen */}
                    <div className="md:hidden mt-6 flex space-x-4">
                        {editing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white transition-all duration-300"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white transition-all duration-300"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

ProfilePage.propTypes = {
    userInfoManager: PropTypes.object,
};

export default ProfilePage;
