import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import Modal from '../../components/ui/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './HomeSlider.module.css';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

export default function HomeSlider() {
  const {
    productsQuery: { isLoading, data: products },
  } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products) {
      const filteredData = products.filter(
        (product) =>
          product.subcategories &&
          product.subcategories.toLowerCase() === 'shoes'
      );
      setFilteredProducts(filteredData);
    }
  }, [products]);

  return (
    <section className={styles.container}>
      {isLoading && <Modal text='Loading...' />}
      <Swiper
        className={styles.swiper}
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
        navigation={{
          prevEl: `.${styles.prev}`,
          nextEl: `.${styles.next}`,
        }}
        rewind={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {filteredProducts &&
          filteredProducts.map((product) => (
            <SwiperSlide key={product.id} className={styles.slide}>
              <button
                type='button'
                onClick={() => {
                  navigate(`/products/${product.id}`, { state: { product } });
                }}
              >
                <img src={product.image} alt={product.title} />
              </button>
              <div className={styles.text}>
                <p className={styles.title}>{product.title}</p>
                <p className={styles.tag}>{product.tags.slice(3, 4)}</p>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className={styles.prev}>
        <BsChevronLeft />
      </div>
      <div className={styles.next}>
        <BsChevronRight />
      </div>
    </section>
  );
}
