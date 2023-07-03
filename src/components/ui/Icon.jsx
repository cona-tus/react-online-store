import React from 'react';
import styles from './Icon.module.css';

export default function Icon({ onClick, children, style }) {
  return (
    <button
      onClick={onClick && (() => onClick())}
      className={`${styles.button}  ${style ? styles[style] : ''}`}
    >
      <span className={styles.icon}>{children}</span>
    </button>
  );
}
