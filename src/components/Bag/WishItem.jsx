import React from 'react';
import useWish from '../../hooks/useWish';
import styles from './WishItem.module.css';
import { VscChromeClose } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

export default function WishItem({ product: { image, title, id }, product }) {
  const { removeWishItem } = useWish();
  const navigate = useNavigate();

  const handleRemove = () => {
    removeWishItem.mutate(id);
  };

  return (
    <li className={styles.item}>
      <img
        src={image}
        alt={title}
        onClick={() => {
          navigate(`/products/${id}`, { state: { product: product } });
        }}
      />
      <button className={styles.button} onClick={handleRemove}>
        <span className={styles.icon}>
          <VscChromeClose />
        </span>
      </button>
    </li>
  );
}
