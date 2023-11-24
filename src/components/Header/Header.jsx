import React from 'react';
import styles from './Header.module.css';

export default function Header({ text }) {
  return (
    <div className={styles.header}>
      {text && <p className={styles.path}>{text}</p>}
    </div>
  );
}
