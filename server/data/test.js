/* this file is strictly for testing db functions. */

const books = require("./books");
const connection = require("../../config/mongoConnection");

const main = async () => {
    try {
        const id = "625d9da2d9d8abeb7f8f68d9";
        const book = await books.get(id);
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
        const db = await connection();
        await db.s.client.close();
        console.log("Done");
    } catch (e) {
        console.log(e);
    }
};

main();
