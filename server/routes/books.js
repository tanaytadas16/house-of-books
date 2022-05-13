const express = require('express');
const router = express.Router();
const booksData = require('../data/books');
const { ObjectId } = require('mongodb');
// const redis = require('redis');

// const client = redis.createClient({
//     url: process.env.REDIS_URL,
//     socket: {
//         rejectUnauthorized: false,
//     },
// });

// (async () => {
//     await client.connect();
// })();

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
    console.log(books);
    res.status(200).json(books);
    return books;
  } catch (e) {
    res.status(500).json({ error: e });
    return e.message;
  }
});

router.get('/mostPopular', async (req, res) => {
  try {
    console.log('Inside most popular');
    let books = await booksData.getMostPopular();
    console.log(books);
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
  // try {
  //     let redisFlag = false;
  let books = await booksData.getById(req.params.id);
  //     // console.log(books);
  //     console.log('Before LRange');
  //     // const recentList = await client.lRange('recents', 0, 19);
  //     // console.log(recentList);
  //     if (recentList.length > 0) {
  //         for (let i = 0; i < recentList.length; i++) {
  //             console.log(books._id);
  //             let redisId = JSON.parse(recentList[i]);
  //             console.log(redisId._id);
  //             if (books._id === redisId._id) {
  //                 redisFlag = true;
  //                 break;
  //             } else {
  //                 continue;
  //             }
  //         }
  //     }
  //     if (!redisFlag) {
  //         console.log('Inside redis else');
  //         await client.lPush('recents', JSON.stringify(books));
  //     }
  res.status(200).json(books);
  return books;
  // } catch (e) {
  //     res.status(404).json({ error: e });
  //     return e.message;
  // }
});

router.post('/purchase', async (req, res) => {
  let bookToBePurchased = req.body.data;
  try {
    if (Object.keys(req.body.data).length === 0) {
      throw `No data provided for buying book`;
    }

    // validateCreations(bookToBePurchased.customerId, bookToBePurchased.bookId);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
    return;
  }
  try {
    let books = await booksData.buyBook(
      bookToBePurchased.customerId,
      bookToBePurchased.bookId,
      bookToBePurchased.quantity,
      bookToBePurchased.totalPrice
    );
    res.status(200).json(books);
    return books;
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Book could not be bought' });
    return e.message;
  }
});
/////////////////////////////////////////////////////////////////////////////  tanay code starts
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
//////////////////////////////////////////////////////////////////////////////  tanay code ends
module.exports = router;
