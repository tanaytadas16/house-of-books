import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import { auth } from '../firebase/firebase';

const Bookshelf = () => {
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [wishListData, setWishListData] = useState();

    // setCurrentUser(currentUser);
    const user = auth.currentUser;
    // setCurrentUserEmail(currentUser);
    // console.log('current user email is', user.email);

    // console.log('currentUser', currentUser.email);
    useEffect(() => {
        async function fetchData() {
            try {
                console.log('before axios');
                const url = `http://localhost:4000/bookshelf`;
                const { data } = await axios.post(url, {
                    data: user.email,
                });
                console.log(data);
                // setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [currentUser]);

    return (
        <div>
            <h1>{currentUser.email}</h1>
        </div>
    );
};

export default Bookshelf;
