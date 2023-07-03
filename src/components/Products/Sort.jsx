import React, { useEffect, useState } from 'react';

import styles from './Sort.module.css';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

const options = [
  { label: 'New', value: 'new' },
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Low Price', value: 'low price' },
  { label: 'High Price', value: 'high price' },
];

export default function Sort({ products, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleOptionChange = (selectedOption) => {
    onChange(selectedOption);
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className={styles.sort}>
      <p className={styles.result}>
        <strong className={styles.num}>{products && products.length}</strong>
        Products Found
      </p>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
        Sort By {isOpen ? <BsChevronUp /> : <BsChevronDown />}
      </button>
      {isOpen && (
        <ul className={styles.options}>
          {options.map(({ label, value }) => (
            <li key={value}>
              <button
                className={styles.option}
                onClick={() => handleOptionChange(value)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
