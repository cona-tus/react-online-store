import React, { useState } from 'react';
import useBag from '../hooks/useBag';
import useWish from '../hooks/useWish';

import Modal from '../components/ui/Modal';
import Header from '../components/Header/Header';
import BagItem from '../components/Bag/BagItem';
import WishItem from '../components/Bag/WishItem';
import OrderSummary from '../components/Bag/OrderSummary';

import styles from './MyBags.module.css';

const filters = ['bag', 'wishlist'];

export default function MyBags() {
  const {
    bagQuery: { isLoading: isLoadingBag, data: bagProducts },
  } = useBag();
  const {
    wishQuery: { isLoading: isLoadingWish, data: wishProducts },
  } = useWish();
  const [filter, setFilter] = useState(filters[0]);

  if (isLoadingBag || isLoadingWish) return <Modal text={'Loading...'} />;

  const filtered = filter && filter === 'bag' ? bagProducts : wishProducts;
  const isBag = filter && filter === 'bag';

  return (
    <main className={styles.section}>
      <Header text='My Bags' />
      <ul className={styles.filters}>
        {filters &&
          filters.map((value, index) => (
            <li key={index}>
              <button
                className={`${styles.filter} ${
                  filter === value && styles.selected
                }`}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            </li>
          ))}
      </ul>
      <ul className={`${styles.content} ${!isBag && styles.grid}`}>
        {isBag && (
          <>
            <li className={styles.title}>
              <span></span>
              <span></span>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </li>
            {filtered.map((item) => (
              <BagItem key={item.id} product={item} />
            ))}
          </>
        )}
        {!isBag &&
          filtered.map((item) => <WishItem key={item.id} product={item} />)}
        {!filtered ||
          (filtered.length === 0 && (
            <p
              className={styles.fallback}
            >{`Your ${filter} is currently empty.`}</p>
          ))}
      </ul>
      {isBag && <OrderSummary />}
    </main>
  );
}
