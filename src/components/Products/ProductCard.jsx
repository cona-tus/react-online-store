import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWish from '../../hooks/useWish';
import { useAuthContext } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import styles from './ProductCard.module.css';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

export default function ProductCard({
  product,
  product: { id, image, title, price },
}) {
  const { user, login } = useAuthContext();
  const {
    wishQuery: { isLoading: isLoadingWish, data: wishProducts },
    addOrUpdateWishItem,
    removeWishItem,
  } = useWish();

  const [wishId, setWishId] = useState([]);
  const [success, setSuccess] = useState();
  const navigate = useNavigate();

  const hasId = wishId && wishId.includes(id);

  const handleAdd = () => {
    if (!user) {
      login();
      return;
    }

    addOrUpdateWishItem.mutate(product, {
      onSuccess: () => {
        setSuccess('SAVING CHANGES');
        setTimeout(() => setSuccess(null), 1500);
      },
    });
  };

  const handleRemove = () => {
    removeWishItem.mutate(id, {
      onSuccess: () => {
        setSuccess('SAVING CHANGES');
        setTimeout(() => setSuccess(null), 2000);
      },
    });
  };

  useEffect(() => {
    const wishIds = wishProducts && wishProducts.map((item) => item.id);
    setWishId(wishIds);
  }, [wishProducts]);

  return (
    <>
      {isLoadingWish && <Modal text='Loading...' />}
      {success && <Modal text={success} />}
      <li className={styles.item}>
        <div className={styles.image}>
          <button
            type='button'
            onClick={() => {
              navigate(`/products/${id}`, { state: { product } });
            }}
          >
            <img src={image} alt={title} />
          </button>
        </div>
        <Icon onClick={hasId ? handleRemove : handleAdd} option='mark'>
          {hasId ? <BsBookmarkFill /> : <BsBookmark />}
        </Icon>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>{`₩ ${price.toLocaleString()}`}</p>
        </div>
      </li>
    </>
  );
}
