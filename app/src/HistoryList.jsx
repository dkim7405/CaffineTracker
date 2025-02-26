import { Edit, Trash2, Check, X } from 'lucide-react';
import PropTypes from 'prop-types';

// Format time to "hh:mm AM/PM"
function formatTime(timeString) {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function groupHistory(history) {
    let grouped = {};

    for (let entry of history) {
        if (!grouped[entry.date]) {
            grouped[entry.date] = [];
            grouped[entry.date].push(entry);
        } else {
            grouped[entry.date].push(entry);
        }
    }

    return grouped;
}

function groupAndSortHistory(history) {
    if (!history || history.length === 0) return {};

    // Sort by date and time (latest first)
    history.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        if (dateComparison !== 0) {
            return dateComparison;
        }

        // If dates are the same, sort by time
        return b.time.localeCompare(a.time);
    });

    // Group items by date
    return groupHistory(history);
}

function HistoryList({
    history,
    editingTime,
    editCaffeine,
    editDrinkType,
    setEditCaffeine,
    setEditDrinkType,
    onStartEditing,
    onSaveEdit,
    onCancelEdit,
    onDelete,
}) {

    const groupedHistory = groupAndSortHistory(history);

    return (
        <div className="space-y-6">
            {Object.keys(groupedHistory).length === 0 ? (
                <p className="text-center text-gray-500">No Entries</p>
            ) : (
                Object.entries(groupedHistory).map(([date, entries]) => (
                    <div key={date} className="space-y-4">
                        <h2 className="text-xl font-semibold text-coffee-dark">
                            {date}
                        </h2>

                        {entries.map((entry, idx) => {
                            const isEditing = editingTime === entry.time;

                            return (
                                <div
                                    key={idx}
                                    className="p-6 bg-white shadow-md rounded-lg mb-3 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300"
                                >
                                    {isEditing ? (
                                        <HistoryItemEdit
                                            editCaffeine={editCaffeine}
                                            editDrinkType={editDrinkType}
                                            setEditCaffeine={setEditCaffeine}
                                            setEditDrinkType={setEditDrinkType}
                                            onSave={onSaveEdit}
                                            onCancel={onCancelEdit}
                                        />
                                    ) : (
                                        <HistoryItem
                                            entry={entry}
                                            onStartEditing={onStartEditing}
                                            onDelete={onDelete}
                                        />
                                    )}
                                </div>
                            );}
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
HistoryList.propTypes = {
    history: PropTypes.array,
    editingTime: PropTypes.any,
    editCaffeine: PropTypes.string,
    editDrinkType: PropTypes.string,
    setEditCaffeine: PropTypes.func,
    setEditDrinkType: PropTypes.func,
    onStartEditing: PropTypes.func,
    onSaveEdit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

function HistoryItem({ entry, onStartEditing, onDelete }) {
    return (
        <>
            {/* Time (hh:mm AM/PM) on the left */}
            <div className="mr-6 text-xs text-coffee-dark/70">
                {formatTime(entry.time)}
            </div>

            {/* Drink info in the center */}
            <div className="flex-1">
                <p className="text-lg font-semibold text-coffee-dark mb-1">
                    {entry.drinkType || 'Unknown'}
                </p>
                <p className="text-md text-coffee-dark mb-1">
                    {entry.caffeine} mg
                </p>
            </div>

            {/* Buttons on the right */}
            <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                    onClick={() => onStartEditing(entry)}
                    className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white transition-all duration-300 flex items-center"
                >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(entry.time, entry.date)}
                    className="bg-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center"
                >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                </button>
            </div>
        </>
    );
}
HistoryItem.propTypes = {
    entry: PropTypes.object,
    onStartEditing: PropTypes.func,
    onDelete: PropTypes.func,
};

function HistoryItemEdit({
    editCaffeine,
    editDrinkType,
    setEditCaffeine,
    setEditDrinkType,
    onSave,
    onCancel
}) {
    return (
        <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between">
            <div className="space-y-4">
                <div>
                    <label className="block text-md text-coffee-dark font-semibold mb-2">
                        Drink Type:
                    </label>
                    <input
                        type="text"
                        className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-56 shadow-sm
                       focus:ring-2 focus:ring-coffee-dark focus:outline-none 
                       transition-all duration-200"
                        value={editDrinkType}
                        onChange={(e) => setEditDrinkType(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-md text-coffee-dark font-semibold mb-2">
                        Caffeine (mg):
                    </label>
                    <input
                        type="number"
                        className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-56 shadow-sm
                       focus:ring-2 focus:ring-coffee-dark focus:outline-none 
                       transition-all duration-200"
                        value={editCaffeine}
                        onChange={(e) => setEditCaffeine(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                    onClick={onSave}
                    className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white transition-all duration-300 flex items-center"
                >
                    <Check className="w-5 h-5 mr-2" />
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="bg-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center"
                >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                </button>
            </div>
        </div>
    );
}
HistoryItemEdit.propTypes = {
    editCaffeine: PropTypes.string,
    editDrinkType: PropTypes.string,
    setEditCaffeine: PropTypes.func,
    setEditDrinkType: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

export default HistoryList;
