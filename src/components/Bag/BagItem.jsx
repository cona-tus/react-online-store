import React from 'react';
import useBag from '../../hooks/useBag';
import { useNavigate } from 'react-router-dom';

import styles from './BagItem.module.css';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { VscChromeClose } from 'react-icons/vsc';

export default function BagItem({
  product,
  product: { id, title, price, quantity, image },
}) {
  const { addOrUpdateBagItem, removeBagItem } = useBag();
  const navigate = useNavigate();

  const handleRemove = () => {
    removeBagItem.mutate(product.id);
  };

  const handleMinus = () => {
    if (product.quantity < 2) return;
    addOrUpdateBagItem.mutate({ ...product, quantity: product.quantity - 1 });
  };

  const handlePlus = () => {
    addOrUpdateBagItem.mutate({ ...product, quantity: product.quantity + 1 });
  };

  return (
    <li className={styles.item}>
      <button className={styles.button} onClick={handleRemove}>
        <span className={styles.icon}>
          <VscChromeClose />
        </span>
      </button>
      <div className={styles.image}>
        <img src={image} alt={title} />
      </div>
      <h3
        className={styles.title}
        onClick={() => {
          navigate(`/products/${id}`, {
            state: { product },
          });
        }}
      >
        {title}
      </h3>
      <p className={styles.price}>{`₩ ${price.toLocaleString()}`}</p>
      <div className={styles.quantity}>
        <button className={styles.count} onClick={handleMinus}>
          <span className={styles.icon}>
            <AiOutlineMinus />
          </span>
        </button>
        <span className={styles.num}>{quantity}</span>
        <button className={styles.count} onClick={handlePlus}>
          <span className={styles.icon}>
            <AiOutlinePlus />
          </span>
        </button>
      </div>
      <p className={styles.subtotal}>{`₩ ${(
        price * quantity
      ).toLocaleString()}`}</p>
    </li>
  );
}
