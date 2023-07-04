import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from './HomeGrid.module.css';

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || '';

export default function HomeGrid() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <img
          data-aos='fade-in'
          src={process.env.PUBLIC_URL + '/images/model01-min.jpg'}
          alt='look'
        />
      </div>
      <div className={styles.right}>
        <div
          data-aos='fade-left'
          data-aos-duration='1500'
          className={styles.product}
        >
          <img
            src={process.env.PUBLIC_URL + '/images/tshirt06-min.jpg'}
            alt='tshirt'
          />
        </div>
        <div className={styles.text}>
          <h3 className={styles.title}>Embrace Freedom</h3>
          <p className={styles.description}>
            Our designs serve as a tool for you to naturally express your
            individuality and style. We aim to go beyond the boundaries of
            design and embody the essence of freedom.
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <div
          data-aos='fade-right'
          data-aos-duration='1500'
          className={styles.product}
        >
          <img
            src={process.env.PUBLIC_URL + '/images/tshirt06-min.jpg'}
            alt='tshirt'
          />
        </div>
        <div className={styles.text}>
          <h3 className={styles.title}>Ultimate Comfort</h3>
          <p className={styles.description}>
            We prioritize using high-quality materials and meticulous
            craftsmanship to create our products. As a result, our products
            provide long-lasting comfort and deliver exceptional experiences in
            everyday life.
          </p>
        </div>
      </div>
      <div className={styles.left}>
        <img
          data-aos='fade-in'
          src={process.env.PUBLIC_URL + '/images/model02-min.jpg'}
          alt='look'
        />
      </div>
    </section>
  );
}
