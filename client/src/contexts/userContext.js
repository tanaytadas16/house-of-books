import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChangedListener, createUserDoc } from "../firebase/firebase";

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };

    useEffect(() => {
        const unsunscribe = onAuthStateChangedListener((user) => {
            if (user) {
                createUserDoc(user);
            }
            setCurrentUser(user);
        });

        return unsunscribe;
    }, [])

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}