import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createNativeUser, auth, emailUpdate } from '../firebase/firebase';
import FormInput from './FormInput';
import Button from './Button';
import { UserContext } from '../contexts/userContext';
import '../styles/Signup.scss';

const defaultFormFields = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

const ProfilePage = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [userData, setUserData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const history = useNavigate();

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    username,
    password,
    confirmPassword,
    address,
    city,
    state,
    zip,
  } = formFields;
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log('Current user is ', currentUser.email);

  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
      try {
        console.log('Before axios call in profile page');
        const url = `http://localhost:4000/users/profile/`;
        const { data } = await axios.get(url + currentUser.email);
        console.log(data);
        setUserData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserData({ ...userData, [name]: value });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (currentUser.email !== email) {
      try {
        const { emailData } = await emailUpdate(email);
        setCurrentUser(emailData);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Cannot create user, email already exists');
        } else if (error.code === 'auth/invalid-email') {
          alert('Email is invalid');
        } else {
          console.log('Error creating user', error);
        }
      }
    }

    let dataBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      username: username,
      password: password,
      confirmPassword: confirmPassword,
      address: address,
      city: city,
      state: state,
      zip: zip,
    };
    axios
      .put('http://localhost:4000/users/profile/', { data: dataBody })
      .then(function (response) {
        console.log(response.data);
        history('/', { replace: true });
      });

    // try {
    //   const { user } = await createNativeUser(email, password);
    //   setCurrentUser(user);
    //   resetFormFields();
    // } catch (error) {
    //   if (error.code === 'auth/email-already-in-use') {
    //     alert('Cannot create user, email already exists');
    //   } else {
    //     console.log('Error creating user', error);
    //   }
    // }
  };

  if (loading) {
    if (error) {
      return (
        <div>
          <h2>No books are present in the popular list</h2>
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
            value={password}
            name='password'
          />
          <FormInput
            label='Confirm Password'
            type='password'
            required
            onChange={handleChange}
            value={confirmPassword}
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
          <FormInput
            label='State'
            type='text'
            required
            onChange={handleChange}
            value={userData.state ? userData.state : ''}
            name='lastName'
          />
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
