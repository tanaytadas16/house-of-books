import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import AddToWishlist from './AddToWishlist';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';
import {
  makeStyles,
  Card,
  CardActionArea,
  Grid,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { Button } from '@mui/material';
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #222',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
    color: '#222',
  },
  titleHead: {
    borderBottom: '1px solid #222',
    fontWeight: 'bold',
    color: '#222',
    fontSize: 'large',
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  media: {
    height: '100%',
    width: '100%',
  },
  button: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const BooksList = () => {
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const [bookDetailsData, setBookDetailsData] = useState(undefined);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(UserContext);
  const user = auth.currentUser;
  const [userWishlistData, setUserWishlistData] = useState([]);
  const [isInserted, setIsInserted] = useState(0);
  let card = null;
  let userdata = [];
  const getRandomFloat = (max) => {
    return (Math.random() * max).toFixed(2);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `http://localhost:4000/users/bookshelf`;
        const { data } = await axios.post(url, {
          email: currentUser.email,
        });
        console.log('data', data);
        if (data.length === 0) setError(true);

        setBookDetailsData(data);
        setLoading(false);
      } catch (e) {
        setError(true);

        console.log(e);
      }
    }
    fetchData();
  }, [currentUser]);

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

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const buyBook = (title, bookId, price, imageUrl) => {
    price = parseFloat(price);
    let dataBody = {
      email: user.email,
      name: title,
      bookId: bookId,
      price: price,
      imageUrl: imageUrl,
      flag: 'B',
    };
    dispatch(addItemToCart(cartItems, dataBody));
  };
  //// add to wishlist button onclick function

  let onClickWishlist = async (bookId, title) => {
    try {
      // console.log(bookId);
      const url = `http://localhost:4000/users/bookshelf/add`;
      const { data } = await axios.post(url, {
        email: currentUser.email,
        bookId: bookId,
        title: title,
      });
      // console.log(data);
      if (data.inserted === true) setIsInserted(Number(isInserted) + 1);
      // setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  let handleRemoveWishlist = async (bookId, title) => {
    try {
      // console.log('inside remove onclick');
      const url = `http://localhost:4000/users/bookshelf/remove`;
      const { data } = await axios.post(url, {
        email: currentUser.email,
        bookId: bookId,
        title: title,
      });
      // console.log(data);
      if (data.deleted === true) setIsInserted(Number(isInserted) - 1);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(bookId);.
        const url = `http://localhost:4000/users/profile`;
        const { data } = await axios.post(url, {
          data: currentUser.email,
        });
        //

        setUserWishlistData(data.wishlist);
        if (!userWishlistData.wishlist.length === 0) setError(true);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [currentUser, isInserted]);

  const buildCard = (book) => {
    const checkBook = userWishlistData.some((post, index) => {
      return post.bookId === book._id;
    });
    if (checkBook) {
      return (
        <Grid
          item
          xs={10}
          sm={7}
          md={5}
          lg={4}
          xl={3}
          height={45}
          key={book._id}
        >
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
              <Link to={`/books/${book._id}`}>
                <CardMedia
                  className={classes.media}
                  component='img'
                  image={book.url ? book.url : noImage}
                  title='book image'
                />

                <CardContent>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='span'
                  >
                    <p className='title1'>{book.title}</p>
                    <dl>
                      <p>
                        <dt className='title'>Genre:</dt>
                        {book && book.genre ? (
                          <dd>{book.genre}</dd>
                        ) : (
                          <dd>N/A</dd>
                        )}
                      </p>
                      <p>
                        <dt className='title'>Price:</dt>
                        {book && book.price ? (
                          <dd>{book.price}</dd>
                        ) : (
                          <dd>N/A</dd>
                        )}
                      </p>
                    </dl>
                  </Typography>
                </CardContent>
              </Link>
            </CardActionArea>
            {user && (
              <button
                type='button'
                className='button'
                onClick={() =>
                  buyBook(book.title, book._id, book.price, book.url)
                }
              >
                Buy
              </button>
            )}
            {user && !checkBook && (
              <AddToWishlist
                bookid={book._id}
                handleOnClick={() => onClickWishlist(book._id, book.title)}
              />
            )}
            {user && checkBook && (
              <Button
                variant='contained'
                color='error'
                onClick={() => handleRemoveWishlist(book._id, book.title)}
              >
                Remove from Wishlist
              </Button>
            )}
          </Card>
        </Grid>
      );
    }
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
  } else if (bookDetailsData && bookDetailsData.length === 0) {
    return (
      <div>
        <h2>No books found in bookshelf</h2>
      </div>
    );
  } else {
    card =
      bookDetailsData &&
      bookDetailsData.map((book) => {
        return buildCard(book);
      });
    return (
      <div>
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};
export default BooksList;
