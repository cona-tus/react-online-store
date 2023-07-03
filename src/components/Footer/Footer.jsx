import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <ul className={styles.list}>
          <li className={styles.title}>SUPPORT</li>
          <li className={styles.item}>F.A.Q.</li>
          <li className={styles.item}>Exchange & Return</li>
          <li className={styles.item}>Terms And Conditions</li>
        </ul>
        <ul className={styles.list}>
          <li className={styles.title}>FOLLOW US</li>
          <li className={styles.item}>Instagram</li>
          <li className={styles.item}>Facebook</li>
          <li className={styles.item}>Newletter</li>
        </ul>
        <ul className={styles.list}>
          <li className={styles.title}>COMPANY</li>
          <li className={styles.item}>About Us</li>
          <li className={styles.item}>Contact Us</li>
          <li className={styles.item}>Gift Card</li>
        </ul>
      </div>
      <p className={styles.copyright}>
        Copyright 2023 conatus all rights reserved.
      </p>
    </footer>
  );
}
