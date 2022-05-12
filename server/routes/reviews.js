const express = require('express');
const router = express.Router();
const booksData = require('../data/books');
const reviewData = require('../data/reviews');
const errorCheck = require('../data/errorCheck');

router.get('/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json({ error: 'You must supply a valid Book Id' });
    return;
  }
  try {
    const reviewBook = await booksData.getById(req.params.id);
    res.json(reviewBook);
  } catch (e) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }
});

router.get('/userreviews/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json({ error: 'You must supply a valid Book Id' });
    return;
  }
  try {
    const reviewsOfUser = await reviewData.getAllReviewsOfUser(req.params.id);
    res.json(reviewsOfUser);
  } catch (e) {
    res.status(404).json({ error: 'Reviews of user not found' });
    return;
  }
});

router.get('/bookreviews/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json({ error: 'You must supply a valid Book Id' });
    return;
  }
  try {
    const reviewsOfBook = await reviewData.getAllReviewsOfBook(req.params.id);
    res.json(reviewsOfBook);
  } catch (e) {
    res.status(404).json({ error: 'Reviews of book not found' });
    return;
  }
});

router.post('/:id', async (req, res) => {
  let reviewInfo = req.body;

  const currentDate = new Date();
  const dateOfReview =
    currentDate.getMonth() +
    1 +
    '/' +
    currentDate.getDate() +
    '/' +
    currentDate.getFullYear();

  console.log(dateOfReview);
  reviewInfo.rating = parseInt(reviewInfo.rating);

  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json({ error: 'You must supply a valid Book Id' });
    return;
  }

  if (!errorCheck.checkRating(reviewInfo.rating)) {
    res.status(400).json({ error: 'You must supply a valid Rating' });
    return;
  }

  if (!errorCheck.checkString(reviewInfo.comment.trim())) {
    res.status(400).json({ error: 'You must supply a valid Date' });
    return;
  }

  if (!errorCheck.checkDate(dateOfReview.trim())) {
    res.status(400).json({
      error:
        "Date provided is not in proper format. Also please enter today's date",
    });
    return;
  }

  try {
    await booksData.getById(req.params.id);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: 'Book not found' });
    return;
  }

  try {
    const newReview = await reviewData.createReview(
      req.params.id,
      reviewInfo.userId.trim(),
      reviewInfo.rating,
      dateOfReview.trim(),
      reviewInfo.comment.trim(),
      reviewInfo.username.trim()
    );
    res.status(200).json(newReview);
    // const redirectUrl = '/books/' + req.params.id;
    // res.redirect(redirectUrl);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get('/editReview/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json({ error: 'You must supply a valid Review Id' });
    return;
  }
  try {
    const reviewDetails = await reviewData.getReview(req.params.id);
    res.status(200).json(reviewDetails);
  } catch (e) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
});

router.put('/updateReview/', async (req, res) => {
  let updateReviewInfo = req.body;
  updateReviewInfo.rating = parseInt(updateReviewInfo.rating);

  if (!errorCheck.checkId(updateReviewInfo.reviewId.trim())) {
    res.status(400).json({ error: 'You must supply a valid Review Id' });
    return;
  }

  if (!errorCheck.checkRating(updateReviewInfo.rating)) {
    res.status(400).json({ error: 'You must supply a valid Rating' });
    return;
  }

  if (!errorCheck.checkString(updateReviewInfo.comment.trim())) {
    res.status(400).json({ error: 'You must supply a valid Date' });
    return;
  }

  try {
    await reviewData.getReview(updateReviewInfo.reviewId);
  } catch (e) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  try {
    const updatedReview = await reviewData.updateReview(
      updateReviewInfo.reviewId,
      updateReviewInfo.rating,
      updateReviewInfo.comment
    );
    res.redirect('/books/' + updatedReview.bookId);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.delete('/deleteReview/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json({ error: 'You must supply a valid Book Id' });
    return;
  }

  try {
    await reviewData.getReview(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  try {
    const deletedReview = await reviewData.removeReview(req.params.id);
    // res.redirect('/books/' + deletedReview.bookId);
    res.status(200).json(deletedReview);
  } catch (e) {
    console.log(e);
    res
      .status(404)
      .json({ error: 'Review cannot be deleted due to some error' });
  }
});

module.exports = router;
