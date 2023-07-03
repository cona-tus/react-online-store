import React from 'react';
import Loader from './Loader';
import styles from './Modal.module.css';

export default function Modal({ text }) {
  return (
    <div className={styles.modal}>
      <p className={styles.text}>{text}</p>
      <Loader />
    </div>
  );
}
