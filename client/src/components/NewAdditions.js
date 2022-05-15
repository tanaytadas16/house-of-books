import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import { auth } from '../firebase/firebase';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../assets/images/no-image.jpeg';
import { Button } from 'react-bootstrap';
import '../styles/NewAdditions.scss';

const NewAdditions = (props) => {
  const [loading, setLoading] = useState(true);
  const [bookDetailsData, setBookDetailsData] = useState(undefined);
  const { currentUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const user = auth.currentUser;
  let { id } = useParams();
  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
      try {
        const url = `https://houseof-books.herokuapp.com/books/newAdditions`;
        const { data } = await axios.get(url);
        console.log(data);
        setBookDetailsData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [id, currentUser]);

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
      <div className='new-additions-container'>
        {bookDetailsData.map(({ _id, url, title, price }) => (
          <div className='new-additions-card-container' key={_id}>
            <Link to={`/books/${_id}`}>
              <img src={url ? url : noImage} alt={`${title}`} />
            </Link>
            <span className='title'>{title}</span>
            {user && (
              <Button
                className='btn'
                variant='primary'
                onClick={() => buyBook(title, _id, price, url)}
              >
                <span className='price'>
                  ${isNaN(parseInt(price)) ? 7.0 : price}
                </span>
                <span>Add to Cart</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  }
};

export default NewAdditions;
