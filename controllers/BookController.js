const Book = require('../models/Book')
const cloudinary = require('cloudinary').v2
async function addBook(req, res) {
    try {
        cloudinary.config({
            cloud_name: "affrwxfc",
            api_key: "275575453528217",
            api_secret: "6eZKWavVr72RPuPWma1mQqZPoQE"
        })
        const upload = await cloudinary.uploader.upload(req.file.path)
        console.log(upload)
        req.body.bookImage = upload.secure_url
        let book = new Book(req.body)
        await book.save();
        console.log('Data saved successfully...')
        res.status(200).send({ message: 'Data has been saved successfully' })
    } catch (err) {
        res.status(400).send({ message: 'Something went wrong' })
    }
}
async function getBooks(req, res) {
    try {
        // let books = await Book.find({})
        // console.log(books)
        let totalBooks = await Book.countDocuments({})
        console.log(totalBooks)

        let books = await Book.find({ bookTitle: new RegExp(req.query.searchBook, "i") }).skip((req.query.pageNo - 1) * (req.query.booksPerPage)).limit(req.query.booksPerPage);
        res.status(200).send({ data: books, totalBooks: totalBooks })
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}
async function deleteBook(req, res) {
    try {
        let id = req.params.id;
        await Book.deleteOne({ _id: id });
        res.status(200).send({ success: true })
    } catch (err) {
        res.status(400).send({ success: false })
        console.log(err)
    }
}
async function getBookForEdit(req, res) {
    try {
        let id = req.params.id;
        console.log(id)
        let book = await Book.findOne({ _id: id });
        console.log(book)
        res.status(200).send({ data: book })
    } catch (err) {
        res.status(400).send({ data: err })
    }
}

async function editBook(req, res) {
    try {
        let id = req.params.id;
        console.log(id)
        let book = req.body
        console.log(book)
        await Book.updateOne({ _id: id }, req.body);
        console.log("Book updated successfully...")
        res.status(200).send({ success: true })
    } catch (err) {
        console.log(err)
        res.status(400).send({ success: false })
    }
}


// ==========================================
// GET ALL BOOKS
// ==========================================

async function getBooks(req, res) {
  try {

    const books = await Book.find({});

    console.log("Books found:", books.length);

    res.status(200).send({
      success: true,
      data: books,
    });

  } catch (error) {

    console.log("GET BOOKS ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching books",
    });

  }
}


// ==========================================
// GET SINGLE BOOK
// ==========================================

async function getBookById(req, res) {
  try {

    const id = req.params.id;

    console.log("Requested Book ID:", id);

    const book = await Book.findById(id);

    if (!book) {

      return res.status(404).send({
        success: false,
        message: "Book not found",
      });

    }

    console.log("Book found:", book);

    res.status(200).send({
      success: true,
      data: book,
    });

  } catch (error) {

    console.log("GET BOOK BY ID ERROR:", error);

    res.status(400).send({
      success: false,
      message: "Invalid book ID",
    });

  }
}







module.exports = {
    addBook,
    getBooks,
    deleteBook,
    getBookForEdit,
    editBook,
    getBooks,
  getBookById
}