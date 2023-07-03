import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomeMain from '../components/Home/HomeMain';
import HomeGrid from '../components/Home/HomeGrid';
import HomeSlider from '../components/Home/HomeSlider';
import styles from './Home.module.css';

export default function Home() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className={styles.home}>
      <HomeMain />
      <HomeSlider />
      <HomeGrid />
    </section>
  );
}
