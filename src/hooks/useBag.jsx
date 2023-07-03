import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { addOrUpdateToBag, getBag, removeFromBag } from '../api/firebase';

export default function useBag() {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const bagQuery = useQuery(['bags', uid || ''], () => getBag(uid), {
    enabled: !!uid,
  });

  const addOrUpdateBagItem = useMutation(
    (product) => addOrUpdateToBag(uid, product),
    {
      onSuccess: () => queryClient.invalidateQueries(['bags', uid]),
    }
  );

  const removeBagItem = useMutation(
    (productId) => removeFromBag(uid, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bags', uid]);
      },
    }
  );

  return { bagQuery, addOrUpdateBagItem, removeBagItem };
}
