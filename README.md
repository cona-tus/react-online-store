# 🛍️ 온라인 스토어, 'CVXV' 프로젝트

![cvxv-thumb](https://github.com/cona-tus/react-online-store/assets/90844424/34997e4e-c330-4ddf-b187-7665da9ee848)

<br/>

🔗 CVXV [[Live Demo](https://cvxv.netlify.app/)]

<br/>
<br/>

## 1. Project

### 1-1. Project Description

CVXV는 가상의 온라인 스토어입니다. '복사 붙여넣기하듯 언제 어디서나, 자유롭게'라는 아이디어를 바탕으로 'Copy Cut Paste'라는 브랜드를 창조했습니다.

웹 사이트에 사용된 로고는 Adobe Illustrator를, 상품 이미지는 Adobe Photoshop을 사용하여 목업 파일을 기반으로 디자인 작업을 진행했습니다.

사용자는 로그인 후 상품을 장바구니나 위시리스트에 추가하거나 삭제하여 쇼핑을 쉽게 즐길 수 있습니다. 뿐만 아니라, 반응형 웹으로 제작되어 다양한 디바이스에서 언제 어디서나 편리하게 이용 가능합니다.

<br/>

### 1-2. Project Duration & Participants

- 2023-06-15 ~ 2023-07-02
- 개인 프로젝트 (1인)

<br/>
<br/>

# 2. Skills

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff)
![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![POSTCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)
![Firebase](https://img.shields.io/badge/Firebase-FFCB2D?style=for-the-badge&logo=firebase&logoColor=ffffff)

<br/>
<br/>

# 3. Pages

1. Home - 메인 페이지('/')
2. Shop - 전체 상품 목록 페이지('/shop')
3. Shop - 카테고리별 상품 목록 페이지('/shop/:category')
4. ProductDetail - 상품 상세 페이지('/products/:id')
5. NewProduct - 상품 등록 페이지('/products/new')
6. MyBags - 장바구니 페이지('/bags')
7. NotFound - 404 페이지

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />,
      },
      {
        path: '/products/:id',
        element: <ProductDetail />,
      },
      {
        path: '/shop',
        element: <Shop />,
      },
      {
        path: '/shop/:category',
        element: <Shop />,
      },
      {
        path: '/products/new',
        element: (
          <ProtectedRoute requireAdmin>
            <NewProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: '/bags',
        element: (
          <ProtectedRoute>
            <MyBags />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

<br/>
<br/>

## 4. Main Features

1. [로그인 및 로그아웃]()
2. [상품 데이터 불러오기]()
3. [어드민 계정일 경우 상품 등록]()
4. [상품 카테고리별 필터링 및 상품 정렬]()
5. [상품 상세보기]()
6. [장바구니]()
7. [장바구니에 상품 추가]()
8. [상품 수량 변경]()
9. [장바구니에서 상품 삭제]()
10. [위시리스트]()

<br/>

### 4-1. Login & Logout

![cvxv-login](https://github.com/cona-tus/react-online-store/assets/90844424/a274b5ac-4922-47fe-be4e-faaa47012ee7)

사용자 관리는 파이어 베이스의 Authentication에서 제공하는 기능을 통해 이루어집니다.

```js
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
```

<br/>

로그인 및 로그아웃을 구현하기 위해 `signInWithPopup()` 및 `signOut()` 함수를 호출합니다.

```js
// 로그인
export function login() {
  signInWithPopup(auth, provider).catch(console.error);
}

// 로그아웃
export function logout() {
  signOut(auth).catch(console.error);
}
```

<br/>

새로고침시 사용자의 로그인 상태가 초기화되지 않도록 `onAuthStateChanged()` 함수를 호출하여 로그인 상태를 관찰합니다.

```js
// 로그인 상태 확인
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}
```

<br/>

이후 사용자가 어드민 계정인지 판단합니다. 이를 위해 파이어 베이스의 Realtime Database에 저장된 사용자의 admins 배열을 `get` 메서드를 호출하여 가져옵니다. 그리고 사용자의 uid를 포함하고 있는지 확인합니다.

```js
// 어드민 권한 확인
async function adminUser(user) {
  return get(ref(database, 'admins')) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
      return user;
    });
}
```

<br/>

로그인 상태와 같이 앱 전반적으로 동일한 데이터에 접근하려면 컨텍스트를 사용합니다. `onUserStateChange()` 함수를 호출하고 콜백 함수(setUser)를 전달합니다.

```jsx
import { login, logout, onUserStateChange } from '../api/firebase';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();

  // 로그인 상태 업데이트
  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, uid: user && user.uid, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
```

<br/>
<br/>

### 4-2. Show Products

![cvxv-show](https://github.com/cona-tus/react-online-store/assets/90844424/45032f2e-914e-4ce6-afcf-db0a2d7ab026)

Shop 페이지에서는 카테고리에 해당하는 상품 목록을 볼 수 있습니다. `getProducts` 함수로 파이어 베이스 실시간 데이터베이스에서 'products' 데이터를 가져옵니다. 데이터가 있다면 `Object.values` 메서드로 객체의 값만 가져옵니다.

```js
import { ref, get } from 'firebase/database';

// 데이터 가져오기
export async function getProducts() {
  return get(ref(database, 'products')) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    });
}
```

<br/>

React Query를 사용하여 상품 데이터를 캐시하고 업데이트하는 `useProducts` 커스텀 훅을 만듭니다. 이렇게 하면 상품과 관련된 요청을 한 곳에서 효율적으로 관리할 수 있습니다.

```jsx
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getProducts as fetchProducts, addNewProduct } from '../api/firebase';

export default function useProducts() {
  const queryClient = useQueryClient();

  // 쿼리 생성
  const productsQuery = useQuery(['products'], fetchProducts, {
    staleTime: 1000 * 60,
  });

  // addProduct...

  return { productsQuery, addProduct };
}
```

<br/>

`useProducts` 커스텀 훅을 사용해 products 데이터를 불러옵니다. `useFilterAndSort` 커스텀 훅에 products와 option, category를 전달하여 필터링 된 데이터(sortedData)를 받아옵니다. `map` 메서드로 배열을 순회하며 `<ul>` 요소 내에 동적으로 렌더링 합니다.

```jsx
export default function Shop() {
  const { category } = useParams();
  const [option, setOption] = useState();
  const {
    productsQuery: { isLoading, error, data: products },
  } = useProducts();
  const { sortedData } = useFilterAndSort(products, option, category);

  return (
    <div className={styles.layout}>
      <Sort products={sortedData} onChange={setOption} />
      <ul className={styles.items}>
        {sortedData &&
          sortedData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </ul>
    </div>
  );
}
```

<br/>
<br/>

### 4-3. Register a New Product

![cvxv-register](https://github.com/cona-tus/react-online-store/assets/90844424/4da92878-a118-4953-a76a-cefab19b2b1c)

어드민 계정은 '/products/new' 페이지에서 새로운 상품을 등록할 수 있습니다. `addNewProduct()` 함수는 product와 image URL을 전달받아 `set` 메서드를 호출하여 파이어 베이스 실시간 데이터베이스에 데이터를 작성합니다.

```js
import { ref, set } from 'firebase/database';

// 데이터베이스에 상품 등록
export async function addNewProduct(product, image) {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    tags: product.tags.split(','),
  });
}
```

<br/>

useProducts 커스텀 훅의 `addProduct` 함수는 useMutation 훅을 사용해 product와 url 매개변수로 새 상품을 추가하는 비동기 함수입니다. 상품 등록이 성공하면 `invalidateQueries`를 사용해 쿼리를 무효화하고 최신 데이터를 가져옵니다.

```jsx
import { getProducts as fetchProducts, addNewProduct } from '../api/firebase';

export default function useProducts() {
  const queryClient = useQueryClient();

  // const productsQuery...

  const addProduct = useMutation(
    ({ product, url }) => addNewProduct(product, url),
    {
      onSuccess: () => queryClient.invalidateQueries(['products']),
    }
  );

  return { productsQuery, addProduct };
}
```

<br/>

`uploadImage()` 함수에 사용자가 업로드한 file을 전달하여 클라우디너리 URL을 획득하고, `addProduct.mutate`를 호출하여 상품 등록 요청을 보냅니다.

```jsx
import { uploadImage } from '../api/uploader';

export default function NewProduct() {
  // ...
  const { addProduct } = useProducts();

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

  // ...
}
```

<br/>
<br/>

### 4-4. Filter and Sort Products

![cvxv-filter](https://github.com/cona-tus/react-online-store/assets/90844424/e53c4473-8e1b-47b6-8567-820bf19b969e)

사용자는 사이드 바에서 카테고리를 클릭하여 필터링된 상품 목록을 찾을 수 있습니다.

![cvxv-sort](https://github.com/cona-tus/react-online-store/assets/90844424/5ca4b622-d14d-46e6-98f2-37cca4f44945)

상품 목록은 신상품 순, 이름 순, 낮은 가격 순, 높은 가격 순으로 정렬이 가능합니다.

`useFilterAndSort` 커스텀 훅을 만들어 카테고리별로 상품 데이터를 필터링하고, 필터링된 상품들을 옵션에 따라 정렬합니다.

```jsx
export default function useFilterAndSort(products, option, category) {
  const navigate = useNavigate();

  // 일치하는 카테고리가 없다면 Home으로 리다이렉션
  if (
    products &&
    category &&
    !products.some((product) => product.category.toLowerCase() === category)
  ) {
    navigate('/');
  }

  // ...
}
```

`filter` 메서드를 사용해 category에 해당하는 products만 필터링합니다. `useMemo` 훅을 사용해 products와 category 값이 변경될 때만 filteredData를 다시 계산합니다.

```jsx
const filteredData = useMemo(() => {
  return products && category
    ? products.filter((product) => product.category.toLowerCase() === category)
    : products || [];
}, [products, category]);

// ...
```

<br/>

`switch` 문과 `sort` 메서드를 사용해 option 값에 따라 각각 동작을 수행하고 정렬합니다.

```jsx
// ...
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
```

<br/>
<br/>

### 4-5. Show Product Details

![cvxv-detail](https://github.com/cona-tus/react-online-store/assets/90844424/a72edddc-9bd0-4ece-a2ce-63ea10c57260)

상품 목록 페이지에서 개별 상품을 클릭하면 React Router의 `useNavigate` 훅을 사용해 상품 상세 페이지(productDetail)로 이동합니다. 이때 state 객체에 product를 전달합니다.

```jsx
export default function ProductCard({
  product,
  product: { id, image, title, price },
}) {
  const navigate = useNavigate();
  // ...

  // handleAdd...
  // handleRemove...

  return (
    <>
      <li className={styles.item}>
        <div className={styles.image}>
          <img
            src={image}
            alt={title}
            onClick={() => {
              navigate(`/products/${id}`, { state: { product } });
            }}
          />
        </div>
        // ...
      </li>
    </>
  );
}
```

<br/>

ProductDetail 컴포넌트는 파이어 베이스 실시간 데이터베이스에 저장된 상품의 세부 정보를 표시합니다. `useLocation` 훅을 사용해 전달받은 state 객체에서 product 데이터를 가져와 렌더링합니다.

```jsx
export default function ProductDetail() {
  // ...
  const {
    state: {
      product: { id, image, title, description, price, tags, category },
    },
  } = useLocation();

  // handleAdd...
  // addOrUpdateBagItem.mutate...
  // return...
}
```

<br/>
<br/>

### 4-6. My Bags

![cvxv-tab](https://github.com/cona-tus/react-online-store/assets/90844424/bcf2924f-4822-4194-b8d1-ec191ba17da2)

장바구니를 구현하기 위해 파이어 베이스 실시간 데이터베이스에서 userId에 해당하는 bags 정보를 가져옵니다. `get` 메서드와 `ref` 메서드를 사용해 경로를 명시하고, `Object.values`를 사용하여 해당 값만을 읽어옵니다.

```js
import { ref, get } from 'firebase/database';

// 장바구니 불러오기
export async function getBag(userId) {
  return get(ref(database, `bags/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      return Object.values(items);
    });
}
```

<br/>

장바구니와 관련된 쿼리 로직을 한 곳에서 관리하기 위해 `useBag`이라는 커스텀 훅을 만듭니다. 이렇게 하면 컴포넌트를 간결하게 유지하고, 캐싱된 데이터를 효율적으로 처리할 수 있습니다.

사용자 별로 캐시가 이루어지도록 쿼리 키로 uid를 사용합니다. 사용자가 로그인하지 않은 경우 (uid가 falsy일 때), 쿼리가 수행되지 않도록 enabled를 설정합니다. mutation이 성공적으로 완료되면 invalidateQueries를 통해 쿼리를 다시 로드합니다.

```jsx
import { useAuthContext } from '../context/AuthContext';
import { addOrUpdateToBag, getBag, removeFromBag } from '../api/firebase';

export default function useBag() {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const bagQuery = useQuery(['bags', uid || ''], () => getBag(uid), {
    enabled: !!uid,
  });

  // 장바구니에 상품을 추가하거나 업데이트
  const addOrUpdateBagItem = useMutation(
    (product) => addOrUpdateToBag(uid, product),
    {
      onSuccess: () => queryClient.invalidateQueries(['bags', uid]),
    }
  );

  // 장바구니에서 특정 상품 삭제
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
```

<br/>
<br/>

### 4-7. Add item to Cart

![cvxv-add](https://github.com/cona-tus/react-online-store/assets/90844424/710c8307-652a-4fb1-ac2c-4b1473414a2b)

사용자가 상품을 장바구니에 추가하면 파이어 베이스 실시간 데이터베이스에 즉각적으로 반영됩니다. `addOrUpdateToBag` 함수에서 `ref` 메서드로 경로를 명시하고, `set` 메서드로 데이터를 저장하거나 업데이트 합니다.

```js
import { ref, set } from 'firebase/database';

// 장바구니에 상품 추가 또는 업데이트
export async function addOrUpdateToBag(userId, product) {
  return set(ref(database, `bags/${userId}/${product.id}`), product);
}
```

<br/>
<br/>

### 4-8. Change quantity

![cvxv-quantity](https://github.com/cona-tus/react-online-store/assets/90844424/a2f05795-7c32-4edd-89fe-4a5f72cc1e26)

사용자는 추가한 상품의 `+` 또는 `-` 아이콘을 클릭하여 수량을 변경할 수 있습니다. BagItem 컴포넌트는 MyBag 컴포넌트로부터 product를 props로 받아와 개별 상품을 표시합니다. 수량을 변경하면 데이터가 변경된 것이므로 캐시를 업데이트합니다.

```jsx
export default function BagItem({
  product,
  product: { id, title, price, quantity, image },
}) {
  const { addOrUpdateBagItem, removeBagItem } = useBag();
  const navigate = useNavigate();

  // handleRemove...

  // 수량 감소
  const handleMinus = () => {
    if (quantity < 2) return;
    addOrUpdateBagItem.mutate({ ...product, quantity: quantity - 1 });
  };

  // 수량 증가
  const handlePlus = () => {
    addOrUpdateBagItem.mutate({ ...product, quantity: quantity + 1 });
  };

  // ...
}
```

<br/>
<br/>

### 4-9. Remove item

![cvxv-remove](https://github.com/cona-tus/react-online-store/assets/90844424/ddf82266-91a4-411a-937a-901d5b165fcb)

사용자는 `X` 버튼을 눌러 특정 상품을 장바구니에서 삭제할 수 있습니다.

```jsx
export default function BagItem({
  product,
  product: { id, title, price, quantity, image },
}) {
  const { addOrUpdateBagItem, removeBagItem } = useBag();

  const handleRemove = () => {
    removeBagItem.mutate(id);
  };

  // handleMinus...
  // handlePlus...
  // ...
}
```

<br/>

파이어 베이스 실시간 데이터베이스에서 `ref` 메서드로 경로를 찾아 `remove` 메서드로 상품 데이터를 삭제합니다.

```js
import { ref, remove } from 'firebase/database';

// productId와 일치하는 상품 삭제
export async function removeFromBag(userId, productId) {
  return remove(ref(database, `bags/${userId}/${productId}`));
}
```

<br/>
<br/>

### 4-10. Wishlist

![cvxv-wish-add](https://github.com/cona-tus/react-online-store/assets/90844424/cd1f342d-8d7b-40b5-a6f2-38e3424ceb88)

사용자가 ProductCard의 북마크 아이콘을 클릭하여 위시리스트에 상품을 추가 또는 제거할 수 있습니다. 이 기능은 장바구니와 유사한 로직을 사용합니다. 데이터 변경 사항은 파이어 베이스 실시간 데이터베이스에 실시간으로 반영됩니다.

```jsx
export default function ProductCard({
  product,
  product: { id, image, title, price },
}) {
  const { user, login } = useAuthContext();
  const {
    wishQuery: { isLoading: isLoadingWish, data: wishProducts },
    addOrUpdateWishItem,
    removeWishItem,
  } = useWish();

  const [wishId, setWishId] = useState([]);
  const [success, setSuccess] = useState();
  const navigate = useNavigate();
  const hasId = wishId && wishId.includes(id);

  // 위시리스트에 상품 추가
  const handleAdd = () => {
    if (!user) {
      login();
      return;
    }

    addOrUpdateWishItem.mutate(product, {
      onSuccess: () => {
        setSuccess('SAVING CHANGES');
        setTimeout(() => setSuccess(null), 1500);
      },
    });
  };

  // 위시리스트에서 상품 삭제
  const handleRemove = () => {
    removeWishItem.mutate(id, {
      onSuccess: () => {
        setSuccess('SAVING CHANGES');
        setTimeout(() => setSuccess(null), 2000);
      },
    });
  };

//...
```

<br/>

useEffect 훅을 사용해 wishProducts가 변경될 때마다 위시리스트에 있는 각 상품의 id를 추출하여 wishId 배열에 저장합니다. 이렇게 하면 페이지 새로고침 시에도 저장된 위시 아이템을 기억합니다.

```jsx
  // wishId 추출
  useEffect(() => {
    const wishIds = wishProducts && wishProducts.map((item) => item.id);
    setWishId(wishIds);
  }, [wishProducts]);
}
```

<br/>
<br/>

## 5. UI/UX

### 5-1. Sidebar

![cvxv-sidebar](https://github.com/cona-tus/react-online-store/assets/90844424/18bbc8f0-b0e1-4130-b61b-cd9881c64ff6)

Navbar의 메뉴 아이콘을 클릭하면 Sidebar가 나타나고, `x` 또는 바탕화면을 클릭하면 사이드바가 닫힙니다. `Sidebar` 컴포넌트에 사이드 바의 열림 상태(`isOpen`)와 닫힘 함수(`onClose`)를 props로 전달합니다.

```jsx
export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // 사이드바 열기
  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };

  // 사이드바 닫기
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // 페이지 이동 시 사이드바 닫기
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <nav className={styles.nav}></nav>
    </>
  );
}
```

<br/>

`Sidebar` 컴포넌트는 사용자가 페이지 이동할 수 있는 링크 목록을 나타냅니다. 사이드바의 열림/닫힘 상태인 `isOpen`과 사이드바를 닫는 함수인 `onClose` 함수를 props로 받습니다.

```jsx
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthContext();

  // isOpen의 상태에 따라 클래스를 달리 적용
  const sidebarClasses = `${styles.container} ${
    isOpen ? styles.open : styles.close
  }`;

  return (
    <>
      {isOpen && <Overlay onClose={onClose} />}
      <aside className={sidebarClasses}>
        <Icon onClick={onClose} option='close'>
          <VscChromeClose />
        </Icon>
        <ul className={styles.links}>
          {user && user.isAdmin && (
            <li className={styles.link}>
              <Link to='/products/new'>Register Product</Link>
            </li>
          )}
          {link.map((value, index) => (
            <li key={index} className={styles.link}>
              <Link to={value.link}>{value.title}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
```

<br/>

`aside` 요소에 fixed postion을 적용하여 화면 상위에 나타나도록 합니다. `open/close` 클래스를 통해 container를 X방향으로 이동시킵니다.

```css
.container {
  width: 30%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--black-500);
  z-index: 999;
}

.open {
  transform: translateX(0);
  transition: transform 300ms ease-in;
}

.close {
  transform: translateX(-100%);
  transition: transform 300ms ease-in;
}

.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
```

<br/>
<br/>

### 5-2. Responsive Web

CVXV 웹 사이트는 반응형으로 디자인되어 다양한 디바이스에 최적화된 레이아웃을 볼 수 있습니다. 이로써 사용자가 웹 사이트를 더욱 편리하게 이용할 수 있도록 합니다.

![cvxv-mobile01](https://github.com/cona-tus/react-online-store/assets/90844424/45a29a7d-5136-4d3b-8c2c-6215d7201f78)
![cvxv-mobile02](https://github.com/cona-tus/react-online-store/assets/90844424/c146c2e4-39df-44b0-a056-31e87d16799f)
