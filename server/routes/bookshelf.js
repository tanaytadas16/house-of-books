const express = require('express');
const router = express.Router();
const booksData = require('../data/books');
const ErrorCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
    try {
    } catch (error) {
        response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
            serverResponse: error.message || 'Internal server error.',
        });
    }
});
const throwError = (code = 404, message = 'Not found') => {
    throw { code, message };
};
const restrictRequestQuery = (request, response) => {
    if (Object.keys(request.query).length > 0) {
        throw { code: 400, message: 'Request query not allowed.' };
    }
};
module.exports = router;
