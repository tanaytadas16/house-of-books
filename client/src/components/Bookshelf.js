import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';

const Bookshelf = () => {
    // const { currentUser, setCurrentUser } = useContext(UserContext);
    // console.log(currentUser);
    // const [loading, setLoading] = useState(true);
    // const [wishListData, setWishListData] = useState();
    // // console.log('currentUser', currentUser.email);
    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const url = `http://localhost:4000/bookshelf`;
    //             const { data } = await axios.post(url, {
    //                 userEmail: currentUser.email,
    //             });
    //             console.log(data);
    //             // setBookDetailsData(data);
    //             setLoading(false);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    //     fetchData();
    // }, []);
    return (
        <div>
            <h1>User Bookshelf</h1>
        </div>
    );
};

export default Bookshelf;
