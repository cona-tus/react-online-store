import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useFilterAndSort from '../hooks/useFilterAndSort';
import Header from '../components/Header/Header';
import ProductCard from '../components/Products/ProductCard';
import Sort from '../components/Products/Sort';
import Modal from '../components/ui/Modal';
import styles from './Shop.module.css';

export default function Shop() {
  const { category } = useParams();
  const [option, setOption] = useState();
  const {
    productsQuery: { isLoading, error, data: products },
  } = useProducts();
  const { sortedData } = useFilterAndSort(products, option, category);

  if (isLoading) return <Modal text={'Loading...'} />;
  if (error) return <Modal text={'Something went wrong'} />;

  return (
    <main className={styles.section}>
      <Header
        text={
          category
            ? `Shop / ${category.charAt(0).toUpperCase() + category.slice(1)}`
            : 'Shop / All Products'
        }
      />
      <section className={styles.text}>
        <h3 className={styles.title}>Copy Paste - Cut Paste</h3>
        <p className={styles.description}>
          CVXV stands for Copy Paste Cut Paste, representing the meaning of
          being able to find what you want anytime, anywhere. We are a brand
          that offers high-quality products in various fields such as fashion,
          living, and stationery.&nbsp;
          <span className={styles.none}>
            We pursue freedom and comfort, and our products are presented with
            designs and quality that reflect these values. With our products,
            which are meticulously crafted and curated, we strive to provide you
            with a sense of individuality and fulfillment.
          </span>
          &nbsp;Experience the essence of CVXV, where your desires come to life.
        </p>
      </section>
      <section className={styles.layout}>
        <Sort products={sortedData} onChange={setOption} />
        <ul className={styles.items}>
          {sortedData &&
            sortedData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </ul>
      </section>
    </main>
  );
}
