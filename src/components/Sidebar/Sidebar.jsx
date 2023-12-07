import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { link } from '../../util/link';
import styles from './Sidebar.module.css';
import { VscChromeClose } from 'react-icons/vsc';

const Overlay = ({ onClose }) => {
  return <div className={styles.overlay} onClick={onClose}></div>;
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthContext();
  const buttonRef = useRef(null);

  const sidebarClasses = `${styles.container} ${
    isOpen ? styles.open : styles.close
  }`;

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <Overlay onClose={onClose} />}
      <aside className={sidebarClasses}>
        <button ref={buttonRef} onClick={onClose} className={styles.button}>
          <span className={styles.icon}>
            <VscChromeClose />
          </span>
        </button>
        <ul className={styles.links}>
          {user && user.isAdmin && (
            <li className={styles.link}>
              <Link to='/products/new'>Register Product</Link>
            </li>
          )}
          {link.map((value, index) => (
            <li key={index} className={styles.link}>
              <Link to={value.link}>{value.title}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
