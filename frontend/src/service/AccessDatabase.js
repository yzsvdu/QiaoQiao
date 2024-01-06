// Inside a file named AccessDatabase.js or a component file

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Fetch learned words for a specific user and table
export const getLearnedWords = async (userId, table_uid) => {
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            if (userData && userData.learned && userData.learned[table_uid]) {
                return userData.learned[table_uid];
            } else {

                console.log('Learned words for tableName do not exist', table_uid);
                return [];
            }
        } else {
            console.log('User document does not exist');
            return [];
        }
    } catch (error) {
        console.error('Error fetching learned words:', error);
        return [];
    }
};

// Update learned words for a specific user and table
export const updateLearnedWords = async (userId, table_uid, newLearnedWords) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            [`learned.${table_uid}`]: newLearnedWords,
        });
    } catch (error) {
        console.error('Error updating learned words:', error);
    }
};
