import React from "react";
import "./App.css";
import logo from "./img/books.jpeg";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import BookDetails from "./components/BooksDetails";
import NewAdditions from "./components/NewAdditions";
import BooksList from "./components/BooksList";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className='App-logo' alt='logo' /> */}
          <h1 className="App-title">Welcome to the House of books!</h1>
          <Link className="showlink" to="/books">
            Books
          </Link>
          <Link className="showlink" to="/books/newAdditions">
            New Additions
          </Link>
          <Link className="showlink" to="/library">
            Library
          </Link>
        </header>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/books/newAdditions" element={<NewAdditions />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
