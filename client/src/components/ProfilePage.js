import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import Button from './Button';
import { UserContext } from '../contexts/userContext';
import { getAuth, updateEmail } from 'firebase/auth';
import '../styles/Signup.scss';
import { auth } from '../firebase/firebase';

const ProfilePage = () => {
    const [userData, setUserData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const history = useNavigate();
    const [oldUsername, setOldUsername] = useState(undefined);

    const { currentUser } = useContext(UserContext);
    const auth = getAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `http://localhost:4000/users/profile`;
                const { data } = await axios.post(url, {
                    data: currentUser.email,
                });
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
        const { name, value } = event.target;

        setUserData({ ...userData, [name]: value });
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
            alert('Passwords do not match');
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
            .put('http://localhost:4000/users/profile/', {
                data: dataBody,
            })
            .then(function (response) {
                console.log(response.data);
                history('/', { replace: true });
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
                        value={userData.firstName ? userData.firstName : ''}
                        name='firstName'
                    />
                    <FormInput
                        label='Last Name'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.lastName ? userData.lastName : ''}
                        name='lastName'
                    />
                    <FormInput
                        label='Email'
                        type='email'
                        required
                        onChange={handleChange}
                        value={userData.email ? userData.email : ''}
                        name='email'
                        disabled
                    />
                    <FormInput
                        label='Phone Number'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.phoneNumber ? userData.phoneNumber : ''}
                        name='phoneNumber'
                    />
                    <FormInput
                        label='Username'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.username ? userData.username : ''}
                        name='username'
                    />
                    <FormInput
                        label='Password'
                        type='password'
                        required
                        onChange={handleChange}
                        value={userData.password ? userData.password : ''}
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
                                : ''
                        }
                        name='confirmPassword'
                    />
                    <FormInput
                        label='Address'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.address ? userData.address : ''}
                        name='address'
                    />
                    <FormInput
                        label='City'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.city ? userData.city : ''}
                        name='city'
                    />
                    <label>State</label>
                    <select
                        className='form-input-label'
                        label='State'
                        required
                        onChange={handleChange}
                        value={userData.state ? userData.state : ''}
                        name='state'
                    >
                        <option value='AL'>Alabama</option>
                        <option value='AK'>Alaska</option>
                        <option value='AZ'>Arizona</option>
                        <option value='AR'>Arkansas</option>
                        <option value='CA'>California</option>
                        <option value='CO'>Colorado</option>
                        <option value='CT'>Connecticut</option>
                        <option value='DE'>Delaware</option>
                        <option value='DC'>District Of Columbia</option>
                        <option value='FL'>Florida</option>
                        <option value='GA'>Georgia</option>
                        <option value='HI'>Hawaii</option>
                        <option value='ID'>Idaho</option>
                        <option value='IL'>Illinois</option>
                        <option value='IN'>Indiana</option>
                        <option value='IA'>Iowa</option>
                        <option value='KS'>Kansas</option>
                        <option value='KY'>Kentucky</option>
                        <option value='LA'>Louisiana</option>
                        <option value='ME'>Maine</option>
                        <option value='MD'>Maryland</option>
                        <option value='MA'>Massachusetts</option>
                        <option value='MI'>Michigan</option>
                        <option value='MN'>Minnesota</option>
                        <option value='MS'>Mississippi</option>
                        <option value='MO'>Missouri</option>
                        <option value='MT'>Montana</option>
                        <option value='NE'>Nebraska</option>
                        <option value='NV'>Nevada</option>
                        <option value='NH'>New Hampshire</option>
                        <option value='NJ'>New Jersey</option>
                        <option value='NM'>New Mexico</option>
                        <option value='NY'>New York</option>
                        <option value='NC'>North Carolina</option>
                        <option value='ND'>North Dakota</option>
                        <option value='OH'>Ohio</option>
                        <option value='OK'>Oklahoma</option>
                        <option value='OR'>Oregon</option>
                        <option value='PA'>Pennsylvania</option>
                        <option value='RI'>Rhode Island</option>
                        <option value='SC'>South Carolina</option>
                        <option value='SD'>South Dakota</option>
                        <option value='TN'>Tennessee</option>
                        <option value='TX'>Texas</option>
                        <option value='UT'>Utah</option>
                        <option value='VT'>Vermont</option>
                        <option value='VA'>Virginia</option>
                        <option value='WA'>Washington</option>
                        <option value='WV'>West Virginia</option>
                        <option value='WI'>Wisconsin</option>
                        <option value='WY'>Wyoming</option>
                    </select>
                    {/* <FormInput
            label='State'
            type='text'
            required
            onChange={handleChange}
            value={userData.state ? userData.state : ''}
            name='state'
          /> */}
                    <FormInput
                        label='Zip'
                        type='text'
                        required
                        onChange={handleChange}
                        value={userData.zip ? userData.zip : ''}
                        name='zip'
                    />
                    <Button type='submit'>Update</Button>
                </form>
            </div>
        );
    }
};

export default ProfilePage;
