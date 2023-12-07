import React from 'react';
import ReactDOM from 'react-dom';
import styles from './SkipNav.module.css';
import { Link } from 'react-router-dom';

export default function SkipNav() {
  return (
    <>
      {ReactDOM.createPortal(
        <div className={styles['skip-nav']}>
          <Link to='/shop' className={styles.link}>
            Show all products
          </Link>
          <a href='#main' className={styles.link}>
            Skip to content
          </a>
        </div>,
        document.getElementById('skip-root')
      )}
    </>
  );
}
