import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createNativeUser } from '../firebase/firebase';
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

const Signup = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
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

  const { setCurrentUser } = useContext(UserContext);
  const history = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    let dataBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      username: username,
      password: password,
      address: address,
      city: city,
      state: state,
      zip: zip,
    };
    try {
      await axios
        .post('http://localhost:4000/users/signup', {
          data: dataBody,
        })
        .then(function (response) {
          console.log(response.data);
          history('/', { replace: true });
        });
    } catch (error) {
      alert(error.response.data);
      return;
    }

    try {
      const { user } = await createNativeUser(email, password);
      setCurrentUser(user);
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already exists');
      } else {
        console.log('Error creating user', error);
      }
    }
  };

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleOnSubmit}>
        <FormInput
          label='First Name'
          type='text'
          required
          onChange={handleChange}
          value={firstName}
          name='firstName'
        />
        <FormInput
          label='Last Name'
          type='text'
          required
          onChange={handleChange}
          value={lastName}
          name='lastName'
        />
        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          value={email}
          name='email'
        />
        <FormInput
          label='Phone Number'
          type='text'
          required
          onChange={handleChange}
          value={phoneNumber}
          name='phoneNumber'
        />
        <FormInput
          label='Username'
          type='text'
          required
          onChange={handleChange}
          value={username}
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
          value={address}
          name='address'
        />
        <FormInput
          label='City'
          type='text'
          required
          onChange={handleChange}
          value={city}
          name='city'
        />
        <label>State</label>
        <select
          className='form-input-label'
          label='State'
          required
          onChange={handleChange}
          value={state}
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
          value={state}
          name='state'
        /> */}
        <FormInput
          label='Zip'
          type='text'
          required
          onChange={handleChange}
          value={zip}
          name='zip'
        />

        <Button type='submit'>Sign Up</Button>
      </form>
    </div>
  );
};

export default Signup;
