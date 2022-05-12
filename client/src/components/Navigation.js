import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { signOutUser } from '../firebase/firebase';
import { ReactComponent as OpenBookLogo } from '../assets/images/openbook.svg';
import '../styles/Navigation.scss';

const Navigation = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log(currentUser);
  const history = useNavigate();

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    history('/', { replace: true });
  };

  return (
    <>
      <div className='navigation'>
        <Link className='logo-container' to='/'>
          <OpenBookLogo className='logo' /> <span>HOUSE OF BOOKS</span>
        </Link>
        <div className='navigation'>
          <div className='nav-links-container'>
            <Link className='nav-link' to='/books'>
              BOOKS
            </Link>
            <Link className='nav-link' to='/books/newAdditions'>
              NEW ADDITIONS
            </Link>
            <Link className='nav-link' to='/library'>
              LIBRARY
            </Link>
            <Link className='nav-link' to='/books/mostPopular'>
              POPULAR BOOKS
            </Link>
            {/* <Link className="nav-link" to="/books/recents">
                            RECENTLY VIEWED
                        </Link> */}
            {currentUser ? (
              <span className='nav-link' onClick={signOutHandler}>
                SIGN OUT
              </span>
            ) : (
              <Link className='nav-link' to='/auth'>
                SIGN IN
              </Link>
            )}
            {currentUser ? (
              <Link className='nav-link' to='/users/profile'>
                PROFILE
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
