import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Marquee from 'react-fast-marquee';
import Button from '../ui/Button';
import styles from './HomeMain.module.css';

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || '';

export default function HomeMain() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className={styles.section}>
      <ul className={styles.container}>
        <li
          className={styles.item}
          data-aos='fade-right'
          data-aos-duration='1000'
        >
          <div className={styles.wrapper}>
            <img
              src={process.env.PUBLIC_URL + '/images/grid00-min.jpg'}
              alt='model'
            />
          </div>
        </li>
        <li
          className={styles.item}
          data-aos='fade-down'
          data-aos-duration='1000'
        >
          <div className={styles.wrapper}>
            <img
              src={process.env.PUBLIC_URL + '/images/tshirt05-min.jpg'}
              alt='tshirt'
            />
          </div>
        </li>
        <li
          className={styles.item}
          data-aos='fade-left'
          data-aos-duration='1000'
        >
          <div className={styles.wrapper}>
            <img
              src={process.env.PUBLIC_URL + '/images/grid02-min.jpg'}
              alt='model'
            />
          </div>
        </li>
        <li className={styles.item} data-aos='fade-up' data-aos-duration='1000'>
          <div className={styles.wrapper}>
            <img
              src={process.env.PUBLIC_URL + '/images/shoe04-min.jpg'}
              alt='shoes'
            />
          </div>
        </li>
        <li className={styles.item} data-aos='fade-up' data-aos-duration='1000'>
          <div className={styles.wrapper}>
            <img
              src={process.env.PUBLIC_URL + '/images/grid04-min.jpg'}
              alt='model'
            />
          </div>
        </li>
      </ul>
      <div className={styles.text}>
        <Marquee direction='left' speed={100} autoFill={true}>
          &nbsp;&nbsp;Fly Beyond Boundaries, Experience the Freedom
        </Marquee>
        <div className={styles['button-container']}>
          <Button
            onClick={() => {
              navigate('/shop');
            }}
          >
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}
