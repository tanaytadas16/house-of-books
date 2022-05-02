import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import noImage from "../img/download.jpeg";
import {
    makeStyles,
    Card,
    Grid,
    CardContent,
    CardMedia,
    Typography,
    CardHeader,
} from "@material-ui/core";
import "../App.css";
const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 5,
        border: "1px solid #222",
        boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
        color: "#222",
    },
    titleHead: {
        borderBottom: "1px solid #222",
        fontWeight: "bold",
        color: "#222",
        fontSize: "large",
    },
    grid: {
        flexGrow: 1,
        flexDirection: "row",
    },
    media: {
        height: "100%",
        width: "100%",
    },
    button: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 12,
    },
});

const BookDetails = (props) => {
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    let {id} = useParams();

    useEffect(() => {
        console.log("useEffect fired");
        async function fetchData() {
            try {
                const url = `http://localhost:4000/books/${id}`;
                const {data} = await axios.get(url);
                console.log(data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [id]);

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
            <Grid
                item
                xs={20}
                sm={11}
                md={5}
                lg={5}
                xl={9}
                key={bookDetailsData._id}
            >
                <Card className={classes.card} variant='outlined'>
                    <CardMedia
                        className={classes.media}
                        component='img'
                        image={
                            bookDetailsData.url ? bookDetailsData.url : noImage
                        }
                        title='book image'
                    />

                    <CardContent>
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            component='span'
                        >
                            <p className='title1'>{bookDetailsData.title}</p>
                            <dl>
                                <p>
                                    <dt className='title'>Description:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.description ? (
                                        <dd>{bookDetailsData.description}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Author:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.author ? (
                                        <dd>{bookDetailsData.author}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>ISBN:</dt>
                                    {bookDetailsData && bookDetailsData.ISBN ? (
                                        <dd>{bookDetailsData.ISBN}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Average Rating:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.averageRating ? (
                                        <dd>{bookDetailsData.averageRating}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Publisher:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.publisher ? (
                                        <dd>{bookDetailsData.publisher}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Genre:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.genre ? (
                                        <dd>{bookDetailsData.genre}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Number of pages:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.numberofPages ? (
                                        <dd>{bookDetailsData.numberofPages}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>
                                        Original Publication Year:
                                    </dt>
                                    {bookDetailsData &&
                                    bookDetailsData.originalPublicationYear ? (
                                        <dd>
                                            {
                                                bookDetailsData.originalPublicationYear
                                            }
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Price:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.price ? (
                                        <dd>$ {bookDetailsData.price}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Year Published:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.yearPublished ? (
                                        <dd>{bookDetailsData.yearPublished}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                            </dl>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
};

export default BookDetails;
