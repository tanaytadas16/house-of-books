const mongoCollections = require('../config/mongoCollection');
const users = mongoCollections.users;

async function getBookshelfBooks() {
    try {
    } catch (error) {
        throwCatchError(error);
    }
}

async function addBooktoBookshelf() {}

const throwError = (code = 404, message = 'Not found') => {
    throw { code, message };
};

const throwCatchError = (error) => {
    if (error.code && error.message) {
        throwError(error.code, error.message);
    }

    throwError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'Error: Internal server error.'
    );
};

module.exports = { getBookshelfBooks, addBooktoBookshelf };
