import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';
import { Alert, Toast } from 'react-bootstrap';
import '../styles/Library.scss';

const Library = (props) => {
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookDetailsData, setBookDetailsData] = useState(undefined);
  const { currentUser } = useContext(UserContext);
  const user = auth.currentUser;

  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
      try {
        const url = `http://localhost:4000/library`;
        const { data } = await axios.get(url);
        console.log(data);
        setBookDetailsData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [currentUser]);

  // function alertFunc(date) {
  //     alert(
  //         'Book has been rented. Please return it within 30 days. Your end date for return is ' +
  //             date
  //     );
  // }

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('/');
  }
  function formatDateNextMonth(date) {
    return [
      padTo2Digits(date.getMonth() + 2),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('/');
  }

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const rentBook = (title, bookId, price, imageUrl) => {
    let todayDate = formatDate(new Date());
    let endDate = formatDateNextMonth(new Date());
    console.log(todayDate);
    let dataBody = {
      email: user.email,
      name: title,
      bookId: bookId,
      price: 7.0,
      imageUrl: imageUrl,
      startDate: todayDate,
      endDate: endDate,
      flag: 'R',
    };
    setToast(true);
    dispatch(addItemToCart(cartItems, dataBody));
  };

  if (loading) {
    return (
      <div>
        {isNaN(bookDetailsData) ? (
          <p>
            <h1>Error 404: Page not found</h1>
          </p>
        ) : (
          <div>
            <h2>Loading....</h2>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className='main-container'>
        <Alert variant='primary'>
          These books can only be rented. Rented books are available only for 30
          days
        </Alert>
        <div className='books-container'>
          {bookDetailsData.map(({ _id, url, title, price }) => (
            <div className='book-card-container' key={_id}>
              <Link to={`/books/${_id}`}>
                <img src={url ? url : noImage} alt={`${title}`} />
              </Link>
              <span className='title'>{title}</span>
              {user && (
                <button
                  className='btn'
                  variant='primary'
                  onClick={() => rentBook(title, _id, price, url)}
                >
                  <span className='price'>
                    ${isNaN(parseInt(price)) ? 7.0 : price}
                  </span>
                  <span>Add to Cart</span>
                </button>
              )}
              {/* <Toast
                onClose={() => setToast(false)}
                show={toast}
                delay={3000}
                autohide
              >
                <Toast.Header>
                  <strong className='me-auto'>Rent Info</strong>
                </Toast.Header>
                <Toast.Body>
                  Rented books are available only for 30 days!
                </Toast.Body>
              </Toast> */}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Library;
