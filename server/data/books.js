const mongoCollections = require("../../config/mongoCollection");
const books = mongoCollections.books;
const library = mongoCollections.library;
const {ObjectId} = require("mongodb");

function validateStringParams(param, paramName) {
    if (!param) {
        throw `Error: No ${paramName} passed to the function`;
    } else if (typeof param !== "string") {
        throw `Type Error: Argument ${param} passed is not a string ${paramName}`;
    } else if (param.length === 0) {
        throw `Error: No element present in string ${paramName}`;
    } else if (!param.trim()) {
        throw `Error: Empty spaces passed to string ${paramName}`;
    }
}
function validateBoolParams(param, paramName) {
    if (!param) {
        throw `Error: No ${paramName} passed to the function`;
    }
    if (typeof param != "boolean") {
        throw `Type Error: Argument ${param} passed is not a boolean ${paramName}`;
    }
}
function validateArray(arryparam, arrname) {
    if (!arryparam) {
        throw `Error: No ${arrname} argument passed to the function`;
    } else if (!Array.isArray(arryparam)) {
        throw `Type Error: Argument ${arrname} passed is not an array`;
    } else if (arryparam.length == 0) {
        throw `Error: No element present in array ${arrname}`;
    } else {
        for (let cuisine of arryparam) {
            validateStringParams(cuisine, "cuisine");
        }
    }
}

function validateRating(element) {
    if (element !== 0 && (!element || typeof element !== "number")) {
        throw `Error : Ratings passed is not a number`;
    }

    if (element < 0 || element > 5) {
        throw `Rating does not lie in valid range`;
    }
}

function validateObject(objParam) {
    if (!objParam) {
        throw "Error: Argument serviceOptions not passed to the function";
    } else if (
        typeof objParam !== "object" ||
        Array.isArray(objParam) ||
        objParam === null
    ) {
        throw "Type Error: Argument serviceOptions passed is not an object";
    } else if (Object.keys(objParam).length === 0) {
        throw "Error: No element present in object serviceOptions";
    } else if (Object.keys(objParam).length > 3) {
        throw "More than 3 options available in serviceOptions";
    }
}
function trimObjectKeys(object) {
    for (let key in object) {
        if (key !== key.trim()) {
            object[key.trim()] = object[key];
            delete object[key];
        }
    }
    return object;
}
function validatePhone(phoneNumber) {
    const validPhone = /^\d{3}-\d{3}-\d{4}$/;
    phoneNumber = phoneNumber.trim();
    if (!phoneNumber.match(validPhone)) {
        throw `Error: ${phoneNumber} is not a valid phone number`;
    }
}

function validateWebsite(websiteLink) {
    const validLink = /^http(s)?:\/\/www\..{5,}\.com$/;
    websiteLink = websiteLink.trim().toLowerCase();
    if (!websiteLink.match(validLink)) {
        throw `Error: ${websiteLink} is not a valid web site link`;
    }
}
function validatePriceRange(priceRange) {
    if (priceRange.length < 0 || priceRange.length > 4) {
        throw `Error: Price Range is not in valid range`;
    } else {
        for (let priceChar of priceRange) {
            if (priceChar !== "$") {
                throw ` Error : Price Range has invalid characters`;
            }
        }
    }
}

async function getById(searchId) {
    validateStringParams(searchId, "Id");
    searchId = searchId.trim();
    if (!ObjectId.isValid(searchId)) {
        throw `Error : Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
    }
    let parseId = ObjectId(searchId);
    const booksCollection = await books();
    const bookFound = await booksCollection.findOne({_id: parseId});
    if (bookFound === null) {
        throw `No book found with the id ${searchId}`;
    } else {
        bookFound["_id"] = searchId;
    }
    return bookFound;
}

async function getAll() {
    let len = arguments.length;
    if (len > 0) {
        throw `Error: getAll does not accept arguments`;
    }
    const booksCollection = await books();

    const booksList = await booksCollection.find({}).toArray();
    if (booksList.length === 0) {
        return [];
    }
    for (let book of booksList) {
        let id = book["_id"];
        book["_id"] = id.toString();
    }
    console.log(booksList);
    return booksList;
}

async function getNewAddition() {
    let len = arguments.length;
    if (len > 0) {
        throw `Error: getAll does not accept arguments`;
    }
    const booksCollection = await books();

    const booksList = await booksCollection
        .find({
            newAddition: true,
        })
        .toArray();
    if (booksList.length === 0) {
        return [];
    }
    for (let book of booksList) {
        let id = book["_id"];
        book["_id"] = id.toString();
    }
    console.log(booksList);
    return booksList;
}

async function getBooksForRent() {
    let len = arguments.length;
    if (len > 0) {
        throw `Error: getAll does not accept arguments`;
    }
    const booksCollection = await books();

    const booksList = await booksCollection
        .find({
            availableForRent: true,
        })
        .toArray();
    if (booksList.length === 0) {
        return [];
    }
    for (let book of booksList) {
        let id = book["_id"];
        book["_id"] = id.toString();
    }
    console.log(booksList);
    return booksList;
}

function validateCreations(customerId, bookId, startDate, endDate, rentedFlag) {
    validateStringParams(customerId, "customerId");
    validateStringParams(bookId, "bookId");
    validateBoolParams(rentedFlag, "rentedFlag");
}

async function addRentedBook(
    customerId,
    bookId,
    startDate,
    endDate,
    rentedFlag
) {
    validateCreations(customerId, bookId, startDate, endDate, rentedFlag);
    customerId = customerId.trim();
    bookId = bookId.trim();
    const libraryCollection = await library();
    let newBook = {
        customerId: customerId,
        bookId: bookId,
        startDate: startDate,
        endDate: endDate,
        rentedFlag: rentedFlag,
    };
    const insertedDatadetails = await libraryCollection.insertOne(newBook);
    if (insertedDatadetails.insertedCount === 0) {
        throw "Book could not be inserted to rent";
    }

    const insertedBookId = insertedDatadetails.insertedId.toString();

    const bookDetails = await getRentedBookById(insertedBookId);
    console.log(bookDetails);
    return bookDetails;
}

async function getRentedBookById(searchId) {
    validateStringParams(searchId, "Id");
    searchId = searchId.trim();
    if (!ObjectId.isValid(searchId)) {
        throw `Error : Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
    }
    let parseId = ObjectId(searchId);
    const libraryCollection = await library();
    const bookFound = await libraryCollection.findOne({_id: parseId});
    if (bookFound === null) {
        throw `No book found with the id ${searchId}`;
    } else {
        bookFound["_id"] = searchId;
    }
    return bookFound;
}

module.exports = {
    getAll,
    getById,
    getNewAddition,
    getBooksForRent,
    addRentedBook,
};
