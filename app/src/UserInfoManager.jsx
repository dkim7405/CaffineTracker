import {
    collection,
    getDocs,
    query,
    where,
    limit,
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// https://www.efsa.europa.eu/sites/default/files/corporate_publications/files/efsaexplainscaffeine150527.pdf
// 3 mg/kg bw per day for adults
const LB_TO_KG = 0.453592;
const MG_PER_KG_PER_DAY = 3;

function getTimeNow() {
	const now = new Date();
	const dateStr = now.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
	const timeStr = now.toLocaleTimeString('en-US', {
		hour12: false
	});

	return { dateStr, timeStr };
}

class UserInfoManager {
    constructor(username, password) {
        this.username = username;
        this.password = password;

        this.docId = null;
        this.userData = null;
    }

    async login() {
        const usersRef = collection(db, 'users');
        const queryUser = query(
            usersRef,
            where('username', '==', this.username),
            where('password', '==', this.password),
            limit(1)
        );

        const snapshot = await getDocs(queryUser);
        if (snapshot.empty) {
            // No matching user found
            this.docId = null;
            this.userData = null;
            return false;
        }

        // Found a matching doc
        const userDoc = snapshot.docs[0];
        this.docId = userDoc.id;
        this.userData = userDoc.data();

        return true;
    }

    async reloadUserData() {
        if (!this.docId) {
            throw new Error('No user is logged in');
        }

        const docRef = doc(db, 'users', this.docId);
        const userSnap = await getDoc(docRef);

        if (!userSnap.exists()) {
            throw new Error(`User doc ${this.docId} does not exist.`);
        }

        this.userData = userSnap.data();
    }

    getUserData() {
        return this.userData;
    }

    async getSafetyLimit() {
        if (!this.userData) {
            throw new Error('No user data loaded.');
        }

        await this.reloadUserData();
        
        let weightKG = this.userData.weightLBS * LB_TO_KG;
        let limitMG = weightKG * MG_PER_KG_PER_DAY;
        
        return Math.round(limitMG);
    }

    async updateName(firstName, lastName) {
        if (!this.docId) {
            throw new Error('No user is logged in.');
        }

        const docRef = doc(db, 'users', this.docId);

        await updateDoc(docRef, {
            firstName,
            lastName
        });

        // update local userData
        this.userData.firstName = firstName;
        this.userData.lastName = lastName;
    }

    async updateWeightLBS(newWeight) {
        if (!this.docId) {
            throw new Error('No user is logged in.');
        }

        const docRef = doc(db, 'users', this.docId);
        await updateDoc(docRef, {
            weightLBS: newWeight
        });
        // update local userData
        this.userData.weightLBS = newWeight;
    }

    async updateTodayIntake(newIntake) {
        if (!this.docId) {
            throw new Error('No user is logged in.');
        }

        const docRef = doc(db, 'users', this.docId);
        await updateDoc(docRef, {
            todayIntake: newIntake
        });
        // update local userData
        this.userData.todayIntake = newIntake;
    }

    async addCaffeineEntry(caffeine, drinkType, dateStr, timeStr) {
        if (!this.docId) {
            throw new Error('No user is logged in.');
        }

        await this.reloadUserData();
        const docRef = doc(db, 'users', this.docId);

        const newEntry = {
            caffeine,
            drinkType,
            date: dateStr,
            time: timeStr
        };

        const historyArr = this.userData.caffeineHistory || [];
        historyArr.push(newEntry);

        await updateDoc(docRef, {
            caffeineHistory: historyArr
        });
        await this.reloadUserData();
        await this.recomputeTodayIntake();
    }

    async deleteCaffeineEntryByDateTime(dateStr, timeStr) {
        if (!this.docId) {
            throw new Error('No user is logged in.');
        }

        await this.reloadUserData();
        const docRef = doc(db, 'users', this.docId);
        const historyArr = this.userData.caffeineHistory || [];

        // Filter out item matching date/time
        const newHistoryArr = historyArr.filter(
            (entry) => !(entry.date === dateStr && entry.time === timeStr)
        );

        if (newHistoryArr.length === historyArr.length) {
            throw new Error(
                `No entry found with date="${dateStr}" and time="${timeStr}"`
            );
        }

        await updateDoc(docRef, {
            caffeineHistory: newHistoryArr
        });
        await this.reloadUserData();
        await this.recomputeTodayIntake();
    }

    // Edit an existing caffeine entry by timestamp
    // Merge updatedFields with the existing entry
    async editCaffeineEntryByDateTime(dateStr, timeStr, updatedFields) {
        if (!this.docId) throw new Error('No user is logged in.');
        await this.reloadUserData();

        const docRef = doc(db, 'users', this.docId);
        const historyArr = this.userData.caffeineHistory || [];

        // Find the item by date/time
        const index = historyArr.findIndex(
            (entry) => entry.date === dateStr && entry.time === timeStr
        );
        if (index === -1) {
            throw new Error(
                `No entry found with date="${dateStr}" and time="${timeStr}"`
            );
        }

        const updatedEntry = { ...historyArr[index], ...updatedFields };
        historyArr[index] = updatedEntry;

        await updateDoc(docRef, { caffeineHistory: historyArr });
        await this.reloadUserData();
        await this.recomputeTodayIntake();
    }

    async recomputeTodayIntake() {
        if (!this.docId) {
            throw new Error('No user is logged in.');
        }

        await this.reloadUserData();
        const docRef = doc(db, 'users', this.docId);

        const { dateStr } = getTimeNow();

        const historyArr = this.userData.caffeineHistory || [];
        let sum = 0;
        for (const entry of historyArr) {
            if (entry.date === dateStr) {
                sum += entry.caffeine;
            }
        }

        await updateDoc(docRef, { todayIntake: sum });
        this.userData.todayIntake = sum;
    }
}

export default UserInfoManager;
