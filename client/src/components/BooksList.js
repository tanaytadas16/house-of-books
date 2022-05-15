import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';
import '../styles/BookList.scss';

const BookList = () => {
  const [loading, setLoading] = useState(true);
  const [bookDetailsData, setBookDetailsData] = useState(undefined);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(UserContext);
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `http://localhost:4000/books`;
        const { data } = await axios.get(url);
        setBookDetailsData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    }
    fetchData();
  }, [currentUser]);

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const buyBook = (title, bookId, price, imageUrl) => {
    let dataBody = {
      email: user.email,
      name: title,
      bookId: bookId,
      price: isNaN(parseInt(price)) ? 7.0 : price,
      imageUrl: imageUrl,
      flag: 'B',
    };
    dispatch(addItemToCart(cartItems, dataBody));
  };

  if (loading) {
    if (error) {
      return (
        <div>
          <h2>No books are present in the list</h2>
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
                onClick={() => buyBook(title, _id, price, url)}
              >
                <span className='price'>
                  ${isNaN(parseInt(price)) ? 7.0 : price}
                </span>
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }
};
export default BookList;
