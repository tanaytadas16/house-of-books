const express = require('express');
const router = express.Router();
const booksData = require('../data/books');
const { ObjectId } = require('mongodb');

const ErrorCode = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

function validateStringParams(param, paramName) {
  if (!param) {
    throw `No ${paramName} entered`;
  } else if (typeof param !== 'string') {
    throw ` Argument ${param} entered is not a string ${paramName}`;
  } else if (param.length === 0) {
    throw ` No ${paramName} entered`;
  } else if (!param.trim()) {
    throw ` Empty spaces entered to ${paramName}`;
  }
}

function validateEmail(email) {
  const emailRegex = /^\S+@[a-zA-Z]+\.[a-zA-Z]+$/;
  if (!emailRegex.test(email)) throw 'Given email id is invalid';
}
function validateNumberParams(param, paramName) {
  if (param < 0) {
    throw `${paramName} can not be negative`;
  }
  if (typeof param === 'number' || !isNaN(param)) {
    if (Number.isInteger(param)) {
      return true;
    } else {
      return true;
    }
  } else {
    throw `Type Error: Argument ${param} passed is not a numeric ${paramName}`;
  }
}

router.get('/', async (req, res) => {
  try {
    let books = await booksData.getAll();
    res.status(200).json(books);
    return books;
  } catch (e) {
    res.status(500).json({ error: e.message });
    return e.message;
  }
});

router.get('/newAdditions', async (req, res) => {
  try {
    let books = await booksData.getNewAddition();
    res.status(200).json(books);
    return books;
  } catch (e) {
    res.status(500).json({ error: e });
    return e.message;
  }
});

router.get('/mostPopular', async (req, res) => {
  try {
    let books = await booksData.getMostPopular();
    res.status(200).json(books);
    return books;
  } catch (e) {
    res.status(500).json({ error: e });
    return e.message;
  }
});

// router.get('/recents', async (req, res) => {
//     let cachedPost = [];
//     console.log('Inside recents');
//     const recentList = await client.lRange('recents', 0, 19);
//     if (recentList.length > 0) {
//         for (let i = 0; i < recentList.length; i++) {
//             cachedPost[i] = JSON.parse(recentList[i]);
//         }
//         res.status(200).json(cachedPost);
//     } else {
//         res.status(400).json('No users present in the recent list');
//     }
// });

router.get('/:id', async (req, res) => {
  try {
    validateStringParams(req.params.id, 'Id');
    req.params.id = req.params.id.trim();
    if (!ObjectId.isValid(req.params.id)) {
      throw `Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let books = await booksData.getById(req.params.id);
    res.status(200).json(books);
    return books;
  } catch (e) {
    res.status(404).json({ error: e });
    return e.message;
  }
});

router.post('/purchase', async (req, res) => {
  let bookToBePurchased = req.body.data;
  try {
    if (Object.keys(req.body.data).length === 0) {
      throw `No data provided for buying book`;
    }
    validateEmail(bookToBePurchased.email);
    validateStringParams(bookToBePurchased.bookId, 'bookId');
    if (!ObjectId.isValid(bookToBePurchased.bookId)) {
      throw `Error : Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
    }
    validateNumberParams(bookToBePurchased.quantity, 'quantity');
    validateNumberParams(bookToBePurchased.totalPrice, 'totalPrice');
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
    return;
  }
  try {
    const currentDate = new Date();
    const dateOfPurchase =
      currentDate.getMonth() +
      1 +
      '/' +
      currentDate.getDate() +
      '/' +
      currentDate.getFullYear();

    let books = await booksData.buyBook(
      bookToBePurchased.email,
      bookToBePurchased.bookId,
      bookToBePurchased.quantity,
      bookToBePurchased.totalPrice,
      dateOfPurchase.trim()
    );
    res.status(200).json(books);
    return books;
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Book could not be bought' });
    return e.message;
  }
});

router.get('/genres', async (request, response) => {
  try {
    restrictRequestQuery(request, response);

    if (Object.keys(request.body).length !== 0) {
      throwError(
        ErrorCode.BAD_REQUEST,
        "Error: Doesn't require fields to be passed."
      );
    }
  } catch (error) {
    response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
      serverResponse: error.message || 'Internal server error.',
    });
  }
});
router.get('/genres/:genre', async (request, response) => {});

const throwError = (code = 404, message = 'Not found') => {
  throw { code, message };
};
const restrictRequestQuery = (request, response) => {
  if (Object.keys(request.query).length > 0) {
    throw { code: 400, message: 'Request query not allowed.' };
  }
};

module.exports = router;
