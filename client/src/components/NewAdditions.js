import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/userContext';
import AddToWishlist from './AddToWishlist';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
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
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #222',
        boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
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

const NewAdditions = (props) => {
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const [error, setError] = useState(false);
    const { currentUser } = useContext(UserContext);
    const user = auth.currentUser;
    const [userWishlistData, setUserWishlistData] = useState([]);
    const [isInserted, setIsInserted] = useState(0);
    let { id } = useParams();
    let card = null;
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
    }, [id]);
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
                if (!userWishlistData.wishlist) setError(true);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [currentUser, isInserted]);

    let checkBook;
    const buildCard = (book) => {
        checkBook = userWishlistData.some((post, index) => {
            return post.bookId === book._id;
        });
        return (
            <Grid item xs={10} sm={7} md={5} lg={4} xl={3} key={book._id}>
                <Card className={classes.card} variant="outlined">
                    <CardActionArea>
                        <Link to={`/books/${book._id}`}>
                            <CardMedia
                                className={classes.media}
                                component="img"
                                image={book.url ? book.url : noImage}
                                title="book image"
                            />

                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                >
                                    <p className="title1">{book.title}</p>
                                    <dl>
                                        <p>
                                            <dt className="title">Genre:</dt>
                                            {book && book.genre ? (
                                                <dd>{book.genre}</dd>
                                            ) : (
                                                <dd>N/A</dd>
                                            )}
                                        </p>
                                        <p>
                                            <dt className="title">Price:</dt>
                                            {book && book.price ? (
                                                <dd>$ {book.price}</dd>
                                            ) : (
                                                <dd>N/A</dd>
                                            )}
                                        </p>
                                    </dl>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                    {user && !checkBook && (
                        <AddToWishlist
                            bookid={book._id}
                            handleOnClick={() =>
                                onClickWishlist(book._id, book.title)
                            }
                        />
                    )}
                    {user && checkBook && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() =>
                                handleRemoveWishlist(book._id, book.title)
                            }
                        >
                            Remove from Wishlist
                        </Button>
                    )}
                </Card>
            </Grid>
        );
    };

    if (loading) {
        return (
            <div>
                {isNaN(bookDetailsData) ? (
                    <h1>Error 404: Page not found</h1>
                ) : (
                    <div>
                        <h2>Loading....</h2>
                    </div>
                )}
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

export default NewAdditions;
