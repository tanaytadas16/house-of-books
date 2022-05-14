const mongoCollections = require("../config/mongoCollection");
const books = mongoCollections.books;
const library = mongoCollections.library;
const {ObjectId} = require("mongodb");
const users = mongoCollections.users;

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

function validateNumberParams(param, paramName) {
    if (typeof param !== "number" || !Number.isInteger(param)) {
        throw `Type Error: Argument ${param} passed is not a numeric ${paramName}`;
    }
    if (param < 0) {
        throw `${paramName} can not be negative`;
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

function validateWebsite(websiteLink) {
    const validLink = /^http(s)/;
    websiteLink = websiteLink.trim().toLowerCase();
    if (!websiteLink.match(validLink)) {
        throw `Error: ${websiteLink} is not a valid web site link`;
    }
}

function validateDate(dateParams) {
    const validDateFormat = /^\d{2}\-\d{2}\-\d{4}$/;
    if (!dateParams.match(validDateFormat)) {
        throw "date is not in valid format";
    }
}

function validateDateOfPurchase(dateParams) {
    const validDateFormat = /^\d{1}\/\d{2}\/\d{4}$/;
    if (!dateParams.match(validDateFormat)) {
        throw "purchase date is not in valid format";
    }
}

function validateEmail(email) {
    const emailRegex = /^\S+@[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(email)) throw "Given email id is invalid";
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
        throw `Error: getNewAddition does not accept arguments`;
    }
    const booksCollection = await books();

    const booksList = await booksCollection
        .find({
            originalPublicationYear: {$gte: 2016},
        })
        .toArray();
    if (booksList.length === 0) {
        return [];
    }
    for (let book of booksList) {
        let id = book["_id"];
        book["_id"] = id.toString();
    }
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
            price: "Not For Sale",
        })
        .toArray();
    if (booksList.length === 0) {
        return [];
    }
    for (let book of booksList) {
        let id = book["_id"];
        book["_id"] = id.toString();
    }
    return booksList;
}
function validateBookCreations(
    ISBN,
    url,
    description,
    author,
    averageRating,
    binding,
    genre,
    numberofPages,
    originalPublicationYear,
    price,
    publisher,
    title,
    yearPublished,
    popular,
    availableForRent
) {
    validateStringParams(ISBN, "ISBN");
    validateWebsite(url, "url");
    validateStringParams(description, "description");
    validateStringParams(author, "author");
    validateStringParams(binding, "binding");
    validateStringParams(genre, "genre");
    validateStringParams(publisher, "publisher");
    validateStringParams(title, "title");
    validateRating(averageRating, "averageRating");
    validateNumberParams(numberofPages, "numberofPages");
    validateNumberParams(originalPublicationYear, "originalPublicationYear");
    validateNumberParams(price, "price");
    validateNumberParams(yearPublished, "yearPublished");
    validateBoolParams(popular, "popular");
    validateBoolParams(availableForRent, "availableForRent");
}
async function addNewBook(
    ISBN,
    url,
    description,
    author,
    averageRating,
    binding,
    genre,
    numberofPages,
    originalPublicationYear,
    price,
    publisher,
    title,
    yearPublished,
    popular,
    availableForRent
) {
    validateBookCreations(
        ISBN,
        url,
        description,
        author,
        averageRating,
        binding,
        genre,
        numberofPages,
        originalPublicationYear,
        price,
        publisher,
        title,
        yearPublished,
        popular,
        availableForRent
    );
    ISBN = ISBN.trim();
    description = description.trim();
    author = author.trim();
    binding = binding.trim();
    genre = genre.trim();
    publisher = publisher.trim();
    title = title.trim();
    const booksCollection = await books();
    let newBook = {
        ISBN: ISBN,
        url: url,
        description: description,
        author: author,
        averageRating: averageRating,
        binding: binding,
        genre: genre,
        numberofPages: numberofPages,
        originalPublicationYear: originalPublicationYear,
        price: price,
        publisher: publisher,
        title: title,
        yearPublished: yearPublished,
        popular: popular,
        availableForRent: availableForRent,
    };
    const insertedDatadetails = await booksCollection.insertOne(newBook);
    if (insertedDatadetails.insertedCount === 0) {
        throw "Book could not be inserted ";
    }

    const insertedBookId = insertedDatadetails.insertedId.toString();

    const bookDetails = await getById(insertedBookId);
    console.log(bookDetails);
    return bookDetails;
}
function validateCreations(email, bookId, startDate, endDate, flag) {
    validateEmail(email);
    validateStringParams(bookId, "bookId");
    if (!ObjectId.isValid(bookId)) {
        throw `Error : Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
    }
    validateStringParams(flag, "flag");
    validateStringParams(startDate, "startDate");
    validateStringParams(endDate, "endDate");
    validateDate(startDate);
    validateDate(endDate);
}

async function addRentedBook(email, bookId, startDate, endDate, flag) {
    validateCreations(email, bookId, startDate, endDate, flag);
    email = email.trim();
    bookId = bookId.trim();
    const libraryCollection = await library();
    let newBook = {
        email: email,
        bookId: bookId,
        startDate: startDate,
        endDate: endDate,
        flag: flag,
    };
    const insertedDatadetails = await libraryCollection.insertOne(newBook);
    if (insertedDatadetails.insertedCount === 0) {
        throw "Book could not be inserted to rent";
    }

    const insertedBookId = insertedDatadetails.insertedId.toString();

    const bookDetails = await getRentedBookById(insertedBookId);

    const userCollection = await users();

    let constUserId = await userCollection.findOne({
        email: email,
    });
    if (constUserId === null) throw `No user with that email.`;

    const newRentedBook = {
        _id: ObjectId(bookId),
        startDate: startDate,
        endDate: endDate,
    };

    const booksArrUpdated = await userCollection.updateOne(
        {email: email},
        {$push: {bookRenting: newRentedBook}}
    );
    if (!booksArrUpdated.matchedCount && !booksArrUpdated.modifiedCount) {
        throw `Could not add rented book to the user db.`;
    }
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

async function buyBook(email, bookId, quantity, totalPrice, dateOfPurchase) {
    validateEmail(email);
    validateStringParams(bookId, "bookId");
    validateNumberParams(quantity, "quantity");
    validateNumberParams(totalPrice, "totalPrice");
    validateDateOfPurchase(dateOfPurchase);
    email = email.trim();
    bookId = bookId.trim();

    const checkBookDetails = await getById(bookId);
    const userCollection = await users();

    let constUserId = await userCollection.findOne({
        email: email,
    });
    if (constUserId === null) throw `No user with that id.`;

    const newBook = {
        _id: ObjectId(bookId),
        quantity: quantity,
        totalPrice: totalPrice,
        dateOfPurchase: dateOfPurchase,
    };

    const booksArrUpdated = await userCollection.updateOne(
        {email: email},
        {$push: {purchasedBooks: newBook}}
    );
    if (!booksArrUpdated.matchedCount && !booksArrUpdated.modifiedCount) {
        throw `Could not add purchased book to the user db.`;
    }
    return newBook;
}

async function getMostPopular() {
    let len = arguments.length;
    if (len > 0) {
        throw `Error: getMostPopular does not accept arguments`;
    }

    const booksCollection = await books();
    const booksList = await booksCollection
        .find({
            popular: true,
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

module.exports = {
    addNewBook,
    getAll,
    getById,
    getNewAddition,
    getBooksForRent,
    addRentedBook,
    buyBook,
    getMostPopular,
};
