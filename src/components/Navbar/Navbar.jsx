import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useBag from '../../hooks/useBag';
import Sidebar from '../Sidebar/Sidebar';
import Icon from '../ui/Icon';
import styles from './Navbar.module.css';
import { BsListNested } from 'react-icons/bs';

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || '';

export default function Navbar() {
  const { user, login, logout } = useAuthContext();
  const {
    bagQuery: { data: products },
  } = useBag();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Icon onClick={handleSidebarOpen} option='menu'>
            <BsListNested />
          </Icon>
          <Link to='/' className={styles.home}>
            <img
              src={process.env.PUBLIC_URL + '/images/cvxv-logo-3d.png'}
              alt='logo'
            />
          </Link>
        </div>
        <ul className={styles.right}>
          <li className={styles.link}>
            {user && (
              <Link to='/bags'>Bag ({products ? products.length : '0'})</Link>
            )}
          </li>
          {user && (
            <li className={`${styles.link} ${styles.user}`}>
              {user.displayName}
            </li>
          )}
          <li className={styles.link}>
            {!user && (
              <button className={styles.button} onClick={login}>
                Login
              </button>
            )}
            {user && (
              <button className={styles.button} onClick={logout}>
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
