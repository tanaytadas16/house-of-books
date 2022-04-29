import React from "react";
import "./App.css";
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <h1 className='App-title'>Welcome to the Marvel API.</h1>
                    <Link className='showlink' to='/'>
                        Home
                    </Link>
                </header>
                <br />
                <br />
                <div className='App-body'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
