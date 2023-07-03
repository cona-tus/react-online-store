import React, { useRef, useState } from 'react';
import { uploadImage } from '../api/uploader';
import useProducts from '../hooks/useProducts';
import Header from '../components/Header/Header';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import styles from './NewProduct.module.css';

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || '';
const DEFAULT_IMAGE = process.env.PUBLIC_URL + '/images/default_logo.png';

export default function NewProduct() {
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();
  const { addProduct } = useProducts();
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      setFile(files && files[0]);
      return;
    }
    setProduct((product) => ({ ...product, [name]: value }));
  };

  const hanleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);

    uploadImage(file) //
      .then((url) => {
        addProduct.mutate(
          { product, url },
          {
            onSuccess: () => {
              setSuccess('The ITEM HAS BEEN ADDED.');
              setTimeout(() => {
                setSuccess(null);
              }, 1500);
            },
          }
        );
      }) //
      .finally(() => {
        fileRef.current.value = '';
        setProduct({});
        setIsUploading(false);
      });
  };

  return (
    <section className={styles.section}>
      {success && <Modal text={success} />}
      <Header text='New Product' />
      <div className={styles.container}>
        <img
          src={file ? URL.createObjectURL(file) : DEFAULT_IMAGE}
          alt='local file'
        />
        <form className={styles.form} onSubmit={hanleSubmit}>
          <h2 className={styles.title}>Register a new product</h2>
          <input
            ref={fileRef}
            type='file'
            accept='image/*'
            name='file'
            required
            onChange={handleChange}
          />
          <input
            type='text'
            name='title'
            value={product.title ?? ''}
            placeholder='Product Title'
            required
            onChange={handleChange}
          />
          <input
            type='number'
            name='price'
            value={product.price ?? ''}
            placeholder='Product Price'
            required
            onChange={handleChange}
          />
          <input
            type='text'
            name='category'
            value={product.category ?? ''}
            placeholder='Product Category'
            required
            onChange={handleChange}
          />
          <input
            type='text'
            name='description'
            value={product.description ?? ''}
            placeholder='Product Description'
            required
            onChange={handleChange}
          />
          <input
            type='text'
            name='tags'
            value={product.tags ?? ''}
            placeholder='tags(separated by commas)'
            required
            onChange={handleChange}
          />
          <div className={styles['button-container']}>
            <Button disabled={isUploading}>Register</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
