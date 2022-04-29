import React from "react";
import "./App.css";
import logo from "./img/books.jpeg";
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import BookDetails from "./components/BooksDetails";

const App = () => {
    return (
        <Router>
            <div className='App'>
                <header className='App-header'>
                    {/* <img src={logo} className='App-logo' alt='logo' /> */}
                    <h1 className='App-title'>
                        Welcome to the House of books.
                    </h1>
                    <Link
                        className='showlink'
                        to='/books/625d9da2d9d8abeb7f8f68d9'
                    >
                        Books
                    </Link>
                </header>
                <br />
                <br />
                <div className='App-body'>
                    <Routes>
                        {/* <Route path='/' element={<Home />} /> */}
                        <Route path='/books/:id' element={<BookDetails />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
