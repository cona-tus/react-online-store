import React from 'react';
import { useNavigate } from 'react-router-dom';
import useBag from '../../hooks/useBag';
import Icon from '../ui/Icon';
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
    removeBagItem.mutate(id);
  };

  const handleMinus = () => {
    if (quantity < 2) return;
    addOrUpdateBagItem.mutate({ ...product, quantity: quantity - 1 });
  };

  const handlePlus = () => {
    addOrUpdateBagItem.mutate({ ...product, quantity: quantity + 1 });
  };

  return (
    <li className={styles.item}>
      <Icon onClick={handleRemove} option='bag'>
        <VscChromeClose />
      </Icon>
      <div className={styles.image}>
        <img
          src={image}
          alt={title}
          onClick={() => {
            navigate(`/products/${id}`, {
              state: { product },
            });
          }}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.price}>{`₩ ${price.toLocaleString()}`}</p>
      <div className={styles.quantity}>
        <Icon onClick={handleMinus} option='bag'>
          <AiOutlineMinus />
        </Icon>
        <span className={styles.num}>{quantity}</span>
        <Icon onClick={handlePlus} option='bag'>
          <AiOutlinePlus />
        </Icon>
      </div>
      <p className={styles.subtotal}>{`₩ ${(
        price * quantity
      ).toLocaleString()}`}</p>
    </li>
  );
}
