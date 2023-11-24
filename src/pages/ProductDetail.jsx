import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import useBag from '../hooks/useBag';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

export default function ProductDetail() {
  const { user, login } = useAuthContext();
  const { addOrUpdateBagItem } = useBag();
  const [success, setSuccess] = useState();
  const {
    state: {
      product: { id, image, title, description, price, tags, category },
    },
  } = useLocation();

  const handleAdd = () => {
    const product = { id, image, title, description, price, tags, quantity: 1 };

    if (!user) {
      login();
      return;
    }

    addOrUpdateBagItem.mutate(product, {
      onSuccess: () => {
        setSuccess('THE ITEM HAS BEEN ADDED TO YOUR BAG');
        setTimeout(() => setSuccess(null), 1500);
      },
    });
  };

  return (
    <main className={styles.section}>
      {success && <Modal text={success} />}
      <div className={styles.left}>
        <img src={image} alt='title' />
      </div>
      <div className={styles.right}>
        <div className={styles.product}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.price}>₩{price.toLocaleString()}</p>
        </div>
        <ul className={styles.tags}>
          <h3 className={styles.subtitle}>Tags</h3>
          {tags &&
            tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                · {tag}
              </li>
            ))}
        </ul>
        <div className={styles.details}>
          <h3 className={styles.subtitle}>Details</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.info}>
          <h3 className={styles.subtitle}>Category</h3>
          <p className={styles.category}>{category}</p>
        </div>
        <div className={styles.info}>
          <h3 className={styles.subtitle}>Product No.</h3>
          <p className={styles.no}>{id.split('-').slice(0, 1)}</p>
        </div>
        <div className={styles['button-container']}>
          <Button onClick={handleAdd}>Add to Bag</Button>
        </div>
      </div>
    </main>
  );
}
