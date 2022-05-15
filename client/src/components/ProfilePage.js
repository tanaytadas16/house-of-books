import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import FormInput from "./FormInput";
import Button from "./Button";
import {UserContext} from "../contexts/userContext";
import {getAuth, updateEmail} from "firebase/auth";
import "../styles/Signup.scss";
import {auth} from "../firebase/firebase";

const ProfilePage = () => {
    const [userData, setUserData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const history = useNavigate();
    const [oldUsername, setOldUsername] = useState(undefined);

    const {currentUser} = useContext(UserContext);
    const auth = getAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `http://localhost:4000/users/profile`;
                const {data} = await axios.post(url, {data: currentUser.email});
                console.log(data);
                setUserData(data);
                setOldUsername(data.username);
                setLoading(false);
            } catch (e) {
                setError(true);
            }
        }
        fetchData();
    }, [currentUser]);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setUserData({...userData, [name]: value});
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        const {
            password,
            confirmPassword,
            firstName,
            lastName,
            email,
            phoneNumber,
            username,
            address,
            city,
            state,
            zip,
        } = event.target.elements;

        if (password.value !== confirmPassword.value) {
            alert("Passwords do not match");
            return;
        }

        let dataBody = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            oldEmail: currentUser.email,
            phoneNumber: phoneNumber.value,
            username: username.value,
            oldUsername: oldUsername,
            password: password.value,
            address: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
        };

        await updateEmail(auth.currentUser, email.value);

        axios
            .put("http://localhost:4000/users/profile/", {
                data: dataBody,
            })
            .then(function (response) {
                console.log(response.data);
                history("/", {replace: true});
            });
    };

    if (loading) {
        if (error) {
            return (
                <div>
                    <h2>No User found, Please sign in</h2>
                </div>
            );
        } else if (!auth.currentUser) {
            return (
                <div>
                    <h2>Please sign in to view the profile page</h2>
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Loading....</h2>
                </div>
            );
        }
    } else {
        return (
            <div className='sign-up-container'>
                <h2>Profile Page</h2>
                <img alt='profile picture' src={userData.image} />
                <form onSubmit={handleOnSubmit}>
                    <FormInput
                        label='First Name'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.firstName ? userData.firstName : ""}
                        name='firstName'
                    />
                    <FormInput
                        label='Last Name'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.lastName ? userData.lastName : ""}
                        name='lastName'
                    />
                    <FormInput
                        label='Email'
                        type='email'
                        required
                        onChange={handleChange}
                        value={userData.email ? userData.email : ""}
                        name='email'
                        disabled
                    />
                    <FormInput
                        label='Phone Number'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.phoneNumber ? userData.phoneNumber : ""}
                        name='phoneNumber'
                    />
                    <FormInput
                        label='Username'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.username ? userData.username : ""}
                        name='username'
                    />
                    <FormInput
                        label='Password'
                        type='password'
                        required
                        onChange={handleChange}
                        value={userData.password ? userData.password : ""}
                        name='password'
                    />
                    <FormInput
                        label='Confirm Password'
                        type='password'
                        required
                        onChange={handleChange}
                        value={
                            userData.confirmPassword
                                ? userData.confirmPassword
                                : ""
                        }
                        name='confirmPassword'
                    />
                    <FormInput
                        label='Address'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.address ? userData.address : ""}
                        name='address'
                    />
                    <FormInput
                        label='City'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.city ? userData.city : ""}
                        name='city'
                    />
                    <FormInput
                        label='State'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.state ? userData.state : ""}
                        name='state'
                    />
                    <FormInput
                        label='Zip'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.zip ? userData.zip : ""}
                        name='zip'
                    />
                    <Button type='submit'>Update</Button>
                </form>
            </div>
        );
    }
};

export default ProfilePage;
