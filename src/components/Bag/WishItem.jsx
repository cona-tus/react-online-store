import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWish from '../../hooks/useWish';
import Icon from '../ui/Icon';
import styles from './WishItem.module.css';
import { VscChromeClose } from 'react-icons/vsc';

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
      <Icon onClick={handleRemove} option='wish'>
        <VscChromeClose />
      </Icon>
    </li>
  );
}
