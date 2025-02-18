import { rtdb } from './firebaseConfig';
import { ref, get } from 'firebase/database';

class CaffeineDrinksDBManager {

    constructor() {
        this.drinksDB = [];

        this.fetchDrinks();
    }

    async fetchDrinks() {
        try {
            // gets object with data list in the val() property
            const snapshot = await get(ref(rtdb));
            if (snapshot.exists()) {
                // get the data list
                const data = snapshot.val();
                
                data.forEach(drink => {
                    this.drinksDB.push(drink);
                });
            }
            else {
                console.log('No drinks found');
            }
        } catch (error) {
            console.error('Error fetching drinks: ', error);
        }
    }
}

export default CaffeineDrinksDBManager;