import React, { useContext, createContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';

import {auth, db} from './firebase';

const AuthorizationContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    const updateUserLearnedList = async (user, tableUIDs) => {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        const existingLearnedObject = docSnap.exists() ? docSnap.data().learned || {} : {};
        const newTableUIDs = tableUIDs.filter(uid => !existingLearnedObject.hasOwnProperty(uid));

        if (newTableUIDs.length > 0) {
            // Update the user document with new tables in the learned list
            newTableUIDs.forEach((uid) => {
                existingLearnedObject[uid] = [];
            });

            try {
                await setDoc(userRef, {
                    learned: existingLearnedObject,
                }, { merge: true });
            } catch (error) {
                console.error("Error updating learned list:", error);
            }
        }
    };

    const createUserDocument = async (user) => {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        const tableUIDsEndpoint =  `api/service/all-tables`;

        try {
            const response = await fetch(tableUIDsEndpoint);
            const tableUIDs = await response.json();

            const initialLearnedObject = {};

            tableUIDs.uids.forEach((uid) => {
                initialLearnedObject[uid] = [];
            });

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    learned: initialLearnedObject,
                });
            } else {
                await updateUserLearnedList(user, tableUIDs.uids);
            }
        } catch (error) {
            console.error("Error setting up account:", error);
            alert("Failed to set up account. Try again!");
        }
    };
    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                createUserDocument(currentUser);
            } else {
                setUser(null); // Set user to null when logged out
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthorizationContext.Provider value={{
            user,
            setUser,
            logOut,
            googleSignIn
        }}>
            {children}
        </AuthorizationContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthorizationContext);
};