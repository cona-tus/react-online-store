import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { addOrUpdateTowish, getWish, removeFromWish } from '../api/firebase';

export default function useWish() {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const wishQuery = useQuery(['wish', uid || ''], () => getWish(uid), {
    enabled: !!uid,
    staleTime: 1000 * 60,
  });

  const addOrUpdateWishItem = useMutation(
    (product) => addOrUpdateTowish(uid, product),
    {
      onSuccess: () => queryClient.invalidateQueries(['wish', uid]),
    }
  );

  const removeWishItem = useMutation(
    (productId) => removeFromWish(uid, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wish', uid]);
      },
    }
  );

  return { wishQuery, addOrUpdateWishItem, removeWishItem };
}
