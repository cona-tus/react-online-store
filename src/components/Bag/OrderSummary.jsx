import React from 'react';
import useBag from '../../hooks/useBag';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import styles from './OrderSummary.module.css';

const SHIPPING = 3000;

export default function OrderSummary() {
  const {
    bagQuery: { isLoading: isLoadingBag, data: bagProducts },
  } = useBag();

  if (isLoadingBag) return <Modal text={'Loading...'} />;

  const totalPrice =
    bagProducts &&
    bagProducts.reduce(
      (prev, current) => prev + parseInt(current.price) * current.quantity,
      0
    );

  return (
    <section className={styles.section}>
      <ul className={styles.order}>
        <h2 className={styles.title}>Bag Totals</h2>
        <li className={styles.item}>
          <h3 className={styles.subtitle}>Subtotal</h3>
          <p className={styles.price}>{`₩ ${totalPrice.toLocaleString()}`}</p>
        </li>
        <li className={styles.item}>
          <h3 className={styles.subtitle}>Shipping</h3>
          <p className={styles.price}>{`₩ ${SHIPPING.toLocaleString()}`}</p>
        </li>
        <li className={styles.item}>
          <h3 className={styles.subtitle}>Total</h3>
          <p className={styles.price}>{`₩ ${(
            totalPrice + SHIPPING
          ).toLocaleString()}`}</p>
        </li>
      </ul>
      <div className={styles['button-container']}>
        <Button>CHECK OUT</Button>
      </div>
    </section>
  );
}
