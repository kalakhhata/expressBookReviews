const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Task 1 & Task 10 (async/await): Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books." });
  }
});

// Task 2 & Task 11 (async/await): Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found.");
        }
      });
    };
    const book = await getBookByISBN();
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 3 & Task 12 (Promises): Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );
    resolve(filteredBooks);
  });

  getBooksByAuthor.then((result) => {
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found for the given author." });
    }
  });
});

// Task 4 & Task 13 (Promises): Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
    resolve(filteredBooks);
  });

  getBooksByTitle.then((result) => {
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found with the given title." });
    }
  });
});

// Task 5: Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
