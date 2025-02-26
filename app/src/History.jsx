/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import HistoryGraph from './HistoryGraph.jsx';
import HistoryList from './HistoryList.jsx';
import LoadingPage from './Loading.jsx';

function HistoryPage({ userInfoManager }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingTime, setEditingTime] = useState(null);
    const [editingDate, setEditingDate] = useState(null);
    const [editCaffeine, setEditCaffeine] = useState('');
    const [editDrinkType, setEditDrinkType] = useState('');

    const reloadHistory = async () => {
        if (!userInfoManager) return;
        try {
            await userInfoManager.reloadUserData();
            const data = userInfoManager.getUserData();
            const caffeineHistory = data.caffeineHistory || [];
            setHistory(caffeineHistory);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to load user data:', err);
        }
    };

    const startEditing = (entry) => {
        setEditingTime(entry.time);
        setEditingDate(entry.date);
        setEditCaffeine(String(entry.caffeine));
        setEditDrinkType(entry.drinkType);
    };

    const handleSaveEdit = async () => {
        if (!editingTime || !editingDate) return;
        try {
            await userInfoManager.editCaffeineEntryByDateTime(editingDate, editingTime, {
                caffeine: parseInt(editCaffeine, 10),
                drinkType: editDrinkType,
            });

            setEditingTime(null);
            setEditingDate(null);
            setEditCaffeine('');
            setEditDrinkType('');

            await reloadHistory();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancelEdit = () => {
        setEditingTime(null);
        setEditingDate(null);
        setEditCaffeine('');
        setEditDrinkType('');
    };

    const handleDelete = async (timeString, dateString) => {
        if (!userInfoManager) return;
        try {
            await userInfoManager.deleteCaffeineEntryByDateTime(dateString, timeString);
            await reloadHistory();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (userInfoManager) {
            reloadHistory();
        }
    }, [userInfoManager]);

    if (!userInfoManager) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold">History</h2>
                <p className="text-red-500">No userInfoManager provided.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col bg-white overflow-y-auto">
            <div className="bg-coffee-dark p-4 shadow text-white">
                <h1 className="text-2xl">Caffeine History</h1>
            </div>

            <div className="p-4">
                <HistoryGraph history={history} />
            </div>

            <div className="p-4 flex-1">
                {isLoading ? (
                    <LoadingPage />
                ) : (
                    <HistoryList
                        history={history}
                        editingTime={editingTime}
                        editCaffeine={editCaffeine}
                        editDrinkType={editDrinkType}
                        setEditCaffeine={setEditCaffeine}
                        setEditDrinkType={setEditDrinkType}
                        onStartEditing={startEditing}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
HistoryPage.propTypes = {
    userInfoManager: PropTypes.object,
};

export default HistoryPage;
