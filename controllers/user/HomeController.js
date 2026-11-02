const Book = require("../../models/Book");
async function getBooks(req, res) {
    try {
        let books = await Book.find({});
        console.log(books);
        res.status(200).send({ data: books });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Something went wrong" });
    }
}
module.exports = { getBooks };