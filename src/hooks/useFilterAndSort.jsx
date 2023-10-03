import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useFilterAndSort(products, option, category) {
  const navigate = useNavigate();

  if (
    products &&
    category &&
    !products.some((product) => product.category.toLowerCase() === category)
  ) {
    navigate('/');
  }

  const filteredData = useMemo(() => {
    return products && category
      ? products.filter(
          (product) => product.category.toLowerCase() === category
        )
      : products || [];
  }, [products, category]);

  const sortedData = useMemo(() => {
    const sortedArray = [...filteredData];
    switch (option) {
      case 'new':
        sortedArray.sort((a, b) => (a.id > b.id ? 1 : -1));
        break;
      case 'alphabetical':
        sortedArray.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
        break;
      case 'low price':
        sortedArray.sort((a, b) => a.price - b.price);
        break;
      case 'high price':
        sortedArray.sort((a, b) => b.price - a.price);
        break;
      default:
        return filteredData;
    }
    return sortedArray;
  }, [filteredData, option]);

  return {
    sortedData,
  };
}
