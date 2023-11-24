import React from 'react';
import styles from './Icon.module.css';

export default function Icon({ onClick, children, option }) {
  return (
    <button
      type='button'
      onClick={onClick && (() => onClick())}
      className={`${styles.button}  ${option ? styles[option] : ''}`}
    >
      <span className={styles.icon}>{children}</span>
    </button>
  );
}
