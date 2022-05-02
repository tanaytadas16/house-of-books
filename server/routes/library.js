const express = require("express");
const router = express.Router();
const booksData = require("../data/books");

router.get("/", async (req, res) => {
    try {
        let books = await booksData.getBooksForRent();
        console.log(books);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(400).json({error: e});
        return e.message;
    }
});

router.post("/", async (req, res) => {
    try {
        let bookToBeRented = req.body;
        let books = await booksData.addRentedBook(
            bookToBeRented.customerId,
            bookToBeRented.bookId,
            bookToBeRented.startDate,
            bookToBeRented.endDate,
            bookToBeRented.rentedFlag
        );
        console.log(books);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(400).json({error: e});
        return e.message;
    }
});

module.exports = router;
