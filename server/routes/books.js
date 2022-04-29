const express = require("express");
const router = express.Router();
const booksData = require("../data/books");

function validateStringParams(param, paramName) {
    if (!param) {
        throw `No ${paramName} entered`;
    } else if (typeof param !== "string") {
        throw ` Argument ${param} entered is not a string ${paramName}`;
    } else if (param.length === 0) {
        throw ` No ${paramName} entered`;
    } else if (!param.trim()) {
        throw ` Empty spaces entered to ${paramName}`;
    }
}

function validateNumber(param, paramName) {
    element = parseInt(param);
    if (element !== 0 && (!element || typeof element !== "number")) {
        throw `Argument ${param} entered is not a numeric ${paramName}`;
    }
}
router.get("/", async (req, res) => {
    try {
        let books = await booksData.getAll();
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(400).json({error: e.message});
        return e.message;
    }
});

router.get("/:id", async (req, res) => {
    try {
        validateStringParams(req.params.id, "Book id");
        let books = await booksData.get(req.params.id);
        console.log(books);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(400).json({error: e});
        return e.message;
    }
    try {
        res.status(200).json();
    } catch (e) {
        res.status(400).json({error: e.message});
        return e.message;
    }
});

module.exports = router;
