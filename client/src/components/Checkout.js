import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { UserContext } from '../contexts/userContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  selectCartItems,
  selectCartTotal,
} from '../store/selector/cartSelector';

import CheckoutItem from './CheckoutItem';
import Button from './Button';

import '../styles/Checkout.scss';

const Checkout = () => {
  const { currentUser } = useContext(UserContext);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const navigate = useNavigate();
  console.log('Cart Items:', cartItems);

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('-');
  }

  const handlePurchase = () => {
    let url = '';
    cartItems.map((cartItem) => {
      if (cartItem.flag === 'B') {
        url = 'http://localhost:4000/books/purchase';
      } else {
        url = 'http://localhost:4000/library';
      }
      axios
        .post(url, {
          data: cartItem,
        })
        .then(function (response) {
          console.log(response.data);
          navigate('/', { replace: true });
        });
    });
  };

  return (
    <div className='checkout-container'>
      <div className='checkout-header'>
        <div className='header-block'>
          <span>Product</span>
        </div>
        <div className='header-block'>
          <span>Description</span>
        </div>
        <div className='header-block'>
          <span>Quantity</span>
        </div>
        <div className='header-block'>
          <span>Price</span>
        </div>
        <div className='header-block'>
          <span>Remove</span>
        </div>
      </div>
      {cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem.bookId} cartItem={cartItem} />
      ))}
      <span className='total'>Total: ${cartTotal.toFixed(2)}</span>
      {currentUser ? (
        cartItems.length ? (
          <Button onClick={handlePurchase}>Purchase items</Button>
        ) : null
      ) : (
        <p className='signin-redirect-container'>
          Please{' '}
          <Link className='signin-link' to='/auth'>
            Sign in
          </Link>{' '}
          to purchase
        </p>
      )}
    </div>
  );
};

export default Checkout;
