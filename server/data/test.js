/* this file is strictly for testing db functions. */

const books = require("./books");
const connection = require("../../config/mongoConnection");

const main = async () => {
    try {
        const id = "626ea903aa3f53db40cc8f97";
        const book = await books.getById(id);
        console.log("book_found", book);
    } catch (e) {
        console.log(e);
    }

    try {
        const allBooks = await books.getAll();
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.getNewAddition();
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.getBooksForRent();
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.addRentedBook(
            "2",
            "1",
            "05-01-2022",
            "06-01-2022",
            true
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const db = await connection();
        await db.s.client.close();
        console.log("Done");
    } catch (e) {
        console.log(e);
    }
};

main();
