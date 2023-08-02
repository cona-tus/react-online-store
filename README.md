# 🛍️ 온라인 스토어, 'CVXV' 프로젝트

![cvxv-thumb](https://github.com/cona-tus/react-online-store/assets/90844424/34997e4e-c330-4ddf-b187-7665da9ee848)

<br/>

[![Netlify Status](https://api.netlify.com/api/v1/badges/ace00044-9288-49df-86d5-eecad482a976/deploy-status)](https://app.netlify.com/sites/cvxv/deploys)

<br/>
<br/>

# 1. Project

## 1-1. Project Description

'CVXV'는 가상의 온라인 스토어입니다. '복사 붙여넣기하듯 언제 어디서나, 자유롭게'라는 아이디어를 바탕으로 'copy cut paste'라는 의미의 브랜드를 창조했습니다. 웹 사이트에 사용된 로고는 일러스트레이터를, 상품 이미지는 포토샵을 사용하여 목업 파일을 기반으로 디자인 작업을 진행했습니다.  
사용자는 로그인 후 상품을 선택하고, 장바구니나 위시리스트에 추가/삭제하여 쇼핑을 즐길 수 있습니다. 어드민 계정을 가진 사용자는 상품 등록도 할 수 있습니다. 또한 반응형으로 제작되어 다양한 디바이스 환경에서 언제 어디서나 편리하게 이용할 수 있습니다.

<br/>

## 1-2. Project Duration & Participants

- 2023-06-15 ~ 2023-07-02
- 개인 프로젝트 (1인)

<br/>
<br/>

# 2. Skills

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff)
![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![POSTCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

# 3. Pages

1. Home - 메인 페이지(`/`)
2. Shop - 전체 상품 목록 페이지(`/shop`)
3. Shop - 카테고리별 상품 목록 페이지(`/shop/:category`)
4. ProductDetail - 상품 상세 페이지(`/products/:id`)
5. NewProduct - 상품 등록 페이지(`/products/new`)
6. MyBags - 장바구니 페이지(`/bags`)
7. NotFound - 404 페이지

```js
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

# 4. Main Features

## - 웹 사이트 주요 기능

1. 로그인/로그아웃
2. 어드민 계정일 경우 상품 등록
3. 상품 카테고리별 필터링 및 상품 정렬
4. 상품 상세 페이지
5. 장바구니 추가/삭제/수량 변경
6. 위시리스트 추가/삭제

<br/>

## 4-1. Login & Logout

![cvxv-login](https://github.com/cona-tus/react-online-store/assets/90844424/a274b5ac-4922-47fe-be4e-faaa47012ee7)

사용자는 Login 버튼을 눌러 구글 사용자 인증 팝업을 통해 로그인할 수 있습니다. 만약 로그인한 사용자의 세션이 남아있다면, 페이지를 새로고침해도 로그인한 상태로 사용자의 정보가 유지됩니다.

로그인과 로그아웃 기능은 firebase/auth 패키지에서 제공하는 `signInWithPopup()` 및 `signOut()` 함수를 호출하여 구현됩니다.

```js
export function login() {
  signInWithPopup(auth, provider).catch(console.error);
}

export function logout() {
  signOut(auth).catch(console.error);
}
```

새로고침시 사용자의 로그인 상태가 초기화되지 않도록 `onAuthStateChanged()` 함수를 호출하여 로그인 상태를 관찰합니다. auth state가 변경될 때마다 전달받은 callback 함수를 호출하여 변경된 사용자 정보를 전달합니다. 이때 사용자 정보(user)가 있다면 어드민 계정인지 확인하고, user가 존재하지 않는다면 null을 전달합니다.

```js
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}
```

사용자가 로그인한 경우, 어드민 권한을 가지고 있는지 확인합니다. 이를 위해 Firebase `database`에 저장된 사용자의 admins 정보를 가져옵니다(get). 사용자의 uid가 데이터베이스의 admins 배열에 포함되어 있는지 확인하여 어드민 계정 여부를 판단합니다.

```js
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

로그인 상태와 같이 애플리케이션 전반적으로 동일한 데이터에 접근하려면 `context`를 사용합니다.

```jsx
const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  // useState를 사용해 사용자 상태를 보관합니다.
  const [user, setUser] = useState();

  // 컴포넌트가 처음으로 마운트되었을 때, useEffect를 사용하여
  // onUserStateChange() 함수를 호출하고 콜백 함수를 전달합니다.
  // setUser를 사용하여 로그인한 사용자의 정보를 업데이트하거나,
  // 로그아웃한 상태인 null로 user를 업데이트합니다.
  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, []);

  return (
    // AuthContext.Provider의 value로
    // user와 uid, login(), logout() 함수를 전달하여
    // App 안에 있는 모든 자식 컴포넌트들이 접근할 수 있도록 합니다.
    <AuthContext.Provider
      value={{ user, uid: user && user.uid, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// context 사용을 간편히 하도록 hook을 만들어 내보냅니다.
export function useAuthContext() {
  return useContext(AuthContext);
}
```

Navbar 컴포넌트에서 context의 user, login, logout을 불러와 사용합니다.

```jsx
export default function Navbar() {
  const { user, login, logout } = useAuthContext();

  // ...

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Icon onClick={handleSidebarOpen} option='menu'>
            <BsListNested />
          </Icon>
          <Link to='/' className={styles.home}>
            <img
              src={process.env.PUBLIC_URL + '/images/cvxv-logo-3d.png'}
              alt='logo'
            />
          </Link>
        </div>
        <ul className={styles.right}>
          <li className={styles.link}>
            {user && (
              <Link to='/bags'>Bag ({products ? products.length : '0'})</Link>
            )}
          </li>
          {user && (
            <li className={`${styles.link} ${styles.user}`}>
              {user.displayName}
            </li>
          )}
          <li className={styles.link}>
            {!user && (
              <button className={styles.button} onClick={login}>
                Login
              </button>
            )}
            {user && (
              <button className={styles.button} onClick={logout}>
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
```

<br/>
<br/>

## 4-2. Register a new product

![cvxv-register](https://github.com/cona-tus/react-online-store/assets/90844424/4da92878-a118-4953-a76a-cefab19b2b1c)

`getProducts`는 Firebase database에서 'products' 데이터를 가져오는 함수입니다. useProducts 커스텀 훅에서 fetchProducts로 사용되었습니다.

```js
export async function getProducts() {
  return get(ref(database, 'products')) //
    .then((snapshot) => {
      // 데이터가 있다면 Object.values로 객체의 값만 가져옵니다.
      // 데이터가 없다면 빈 배열을 반환합니다.
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    });
}
```

React Query를 사용하여 데이터를 가져오고, 캐시하며 업데이트합니다. 이것과 관련된 요청을 한 곳에서 효율적으로 관리하기 위해 커스텀 훅을 만들어 사용합니다. 다음은 useProducts 커스텀 훅입니다.

```jsx
export default function useProducts() {
  const queryClient = useQueryClient();

  // useQuery를 사용하여 'products' 키로 쿼리를 가져옵니다.
  // 이때, `fetchProducts(getProducts)` 함수를 사용하여
  // Firebase에서 데이터를 가져옵니다.
  // staleTime을 설정해 60초간 캐시된 데이터를 반환합니다.
  const productsQuery = useQuery(['products'], fetchProducts, {
    staleTime: 1000 * 60,
  });

  // addProduct는 useMutation 훅을 사용해
  // 'product' 및 'url' 매개변수로 새 상품을 추가하는 비동기 함수입니다.
  // onSuccess 함수는 mutation이 성공 시 호출되며,
  // invalidateQueries를 사용해 'products' 쿼리를 무효화하고,
  // 최신 데이터를 가져옵니다.
  const addProduct = useMutation(
    ({ product, url }) => addNewProduct(product, url),
    {
      onSuccess: () => queryClient.invalidateQueries(['products']),
    }
  );

  // productsQuery와 addProduct를 반환해
  // 상품 데이터를 가져오거나 새 상품을 추가하는 데 사용합니다.
  return { productsQuery, addProduct };
}
```

`addNewProduct()` 함수에 product와 이미지 URL을 전달하여 Firebase database에 데이터를 작성합니다(set). uuid 패키지로 랜덤한 id를 부여하고 products 배열에 추가합니다.

```js
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

다음은 Cloudinary에 사진을 업로드하고 URL을 획득하는 함수입니다.

```js
export async function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: 'POST',
    body: data,
  })
    .then((res) => res.json())
    .then((data) => data.url);
}
```

어드민 권한을 가진 사용자라면 /products/new 페이지에서 새로운 상품을 등록할 수 있습니다.

```jsx
export default function NewProduct() {
  // useState를 사용하여 상품과 업로드할 파일 정보를 저장합니다.
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  // 파일 업로드 상태, 상품 등록 성공 여부를 저장합니다.
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();
  // useProdudcts 훅을 사용해 addProduct 함수를 가져옵니다.
  const { addProduct } = useProducts();
  // useRef로 input 요소에 접근합니다.
  const fileRef = useRef();

  // handleChange는 input 요소 변경 이벤트 핸들러입니다.
  // file과 product 상태를 업데이트합니다.
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      setFile(files && files[0]);
      return;
    }
    setProduct((product) => ({ ...product, [name]: value }));
  };

  // handleSubmit은 폼 제출 이벤트 핸들러입니다.
  const hanleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);

    // uploadImage에 file을 전달하여 cloudinary url을 획득하고,
    // addProduct.mutate를 호출하여 상품 등록 요청을 보냅니다.
    // 성공 시 메세지를 설정하고, 일정 시간 후에 이를 제거합니다.
    // 마지막으로 product와 fileRef를 초기화합니다.
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
          // ...
        </form>
      </div>
    </section>
  );
}
```

<br/>
<br/>

## 4-3. Show Products

![cvxv-show](https://github.com/cona-tus/react-online-store/assets/90844424/45032f2e-914e-4ce6-afcf-db0a2d7ab026)

Shop 컴포넌트는 상품 목록 페이지입니다. 이 페이지에서는 "All Products", "Fashion", "Goods" 카테고리에 해당하는 상품 목록을 보여줍니다.

```jsx
export default function Shop() {
  // useParams 훅을 사용해 파라미터 값을 가져옵니다.
  const { category } = useParams();
  // useState 훅으로 option의 상태를 저장합니다.
  const [option, setOption] = useState();
  // useProducts 커스텀 훅을 사용해 products 데이터를 가져옵니다.
  const {
    productsQuery: { isLoading, error, data: products },
  } = useProducts();
  // useFilterAndSort 커스텀 훅을 사용해 option과 category에 따라 필터링 및 정렬한 데이터를 가져옵니다.
  const { sortedData } = useFilterAndSort(products, option, category);

  // 로딩과 에러 상태를 각각 렌더링합니다.
  if (isLoading) return <Modal text={'Loading...'} />;
  if (error) return <Modal text={'Something went wrong'} />;

  return (
    <section className={styles.section}>
      // ...
      <div className={styles.layout}>
        <Sort products={sortedData} onChange={setOption} />
        <ul className={styles.items}>
          {sortedData &&
            sortedData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </ul>
      </div>
    </section>
  );
}
```

## 4-4. Filter and Sort Products

![cvxv-filter](https://github.com/cona-tus/react-online-store/assets/90844424/e53c4473-8e1b-47b6-8567-820bf19b969e)

사용자는 사이드 바에서 카테고리를 클릭하여 필터링된 상품 목록을 찾을 수 있습니다.

![cvxv-sort](https://github.com/cona-tus/react-online-store/assets/90844424/5ca4b622-d14d-46e6-98f2-37cca4f44945)

상품 목록은 신상품 순, 이름 순, 낮은 가격 순, 높은 가격 순으로 정렬이 가능합니다.

`useFilterAndSort` 커스텀 훅은 카테고리별로 상품 데이터를 필터링하고, 필터링된 상품들을 옵션에 따라 정렬합니다.

```jsx
export default function useFilterAndSort(products, option, category) {
  // products와 category가 모두 존재하면,
  // filter 메서드를 사용해 products를 필터링하여
  // category에 해당하는 상품만 선택합니다.
  // 없다면, 기본적으로 'products'를 반환합니다.
  // useMemo 훅을 사용해
  // products와 category 값이 변경될 때만 filteredData를 다시 계산합니다.
  const filteredData = useMemo(() => {
    return products && category
      ? products.filter(
          (product) => product.category.toLowerCase() === category
        )
      : products || [];
  }, [products, category]);

  // sortedData 변수에 filteredData 배열을 복제합니다.
  // switch문을 사용해  option 값에 따라 각각 동작을 수행합니다.
  // sort 메서드를 사용해 정렬합니다.
  // useMemo를 사용해 filteredData와 option의 값이
  // 변경될 때에만 sortedData를 다시 계산합니다.
  // sortedData를 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
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
```

## 4-5. Show Product Details

![cvxv-detail](https://github.com/cona-tus/react-online-store/assets/90844424/a72edddc-9bd0-4ece-a2ce-63ea10c57260)

상품 목록 페이지에서 개별 상품(ProductCard)을 클릭하면 상품 상세 페이지로 이동합니다. 해당 상세 페이지에서는 Firebase database에 저장된 상품 정보가 게시됩니다.

```jsx
export default function ProductCard({
  product,
  product: { id, image, title, price },
}) {
  // useNavigate 훅을 사용해서 페이지 이동을 할 수 있도록 합니다.
  // img 요소에 onClick 이벤트 핸들러를 등록하여
  // 클릭 시 productDetail 페이지로 이동합니다.
  // 이때 state 객체에 product를 전달합니다.
  const navigate = useNavigate();
  // ...
  return (
    <>
      // ...
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

ProductDetail 컴포넌트는 상품의 세부 정보를 표시합니다. 이 페이지에서 장바구니로 상품을 추가할 수 있습니다.

```jsx
export default function ProductDetail() {
  // useAuthContext 커스텀 훅에서 user와 login 행동 함수를 가져옵니다.
  const { user, login } = useAuthContext();
  // useBag 커스텀 훅을 사용해 상품을 장바구니에 추가하는 함수를 가져옵니다.
  const { addOrUpdateBagItem } = useBag();
  // useState 훅으로 성공 메시지 상태를 관리합니다.
  const [success, setSuccess] = useState();
  // useLocation 훅을 사용해 전달받은 state 객체에서
  // product를 가져옵니다.
  const {
    state: {
      product: { id, image, title, description, price, tags, category },
    },
  } = useLocation();

  // handleAdd는 장바구니에 제품을 추가하는 함수입니다.
  // product 객체에 상품 정보와 수량을 포함시킵니다.
  const handleAdd = () => {
    const product = { id, image, title, description, price, tags, quantity: 1 };

    // 사용자가 로그인하지 않았다면, 로그인을 유도하도록
    // login 함수를 호출합니다.
    if (!user) {
      login();
      return;
    }

    // mutation 함수를 호출해 장바구니 추가 작업을 수행합니다.
    // 첫 번째 인자로 product 객체를 전달하고
    // 두 번째 인자로 onSuccess 콜백 함수를 등록합니다.
    // 성공 메시지를 설정하고 일정 시간 후에 이를 제거합니다.
    addOrUpdateBagItem.mutate(product, {
      onSuccess: () => {
        setSuccess('THE ITEM HAS BEEN ADDED TO YOUR BAG');
        setTimeout(() => setSuccess(null), 1500);
      },
    });
  };

  return (
    // Button에 onClick 이벤트 핸들러를 등록해
    // handleAdd를 트리거합니다.
    <section className={styles.section}>
      {success && <Modal text={success} />}
      // ...
      <div className={styles['button-container']}>
        <Button onClick={handleAdd}>Add to Bag</Button>
      </div>
    </section>
  );
}
```

<br/>
<br/>

## 4-6. My Bags

![cvxv-tab](https://github.com/cona-tus/react-online-store/assets/90844424/bcf2924f-4822-4194-b8d1-ec191ba17da2)

MyBags 페이지는 장바구니와 위시리스트로 구성되어 있습니다. BAG 또는 WISHLIST를 클릭하면 조건부 렌더링을 통해 구현됩니다.

```jsx
// 장바구니와 위시리스트를 필터링하고자 filters 배열을 정의합니다.
const filters = ['bag', 'wishlist'];

export default function MyBags() {
  // useBag, useWish 커스텀 훅을 사용하여
  // 사용자의 장바구니와 위시리스트 데이터를 가져옵니다.
  const {
    bagQuery: { isLoading: isLoadingBag, data: bagProducts },
  } = useBag();
  const {
    wishQuery: { isLoading: isLoadingWish, data: wishProducts },
  } = useWish();

  // useState 훅으로 filter 상태를 관리합니다.
  const [filter, setFilter] = useState(filters[0]);

  // 로딩 메시지를 표시합니다.
  if (isLoadingBag || isLoadingWish) return <Modal text={'Loading...'} />;

  // 선택된 필터에 따라 장바구니 또는 위시리스트 데이터를 보여줍니다.
  const filtered = filter && filter === 'bag' ? bagProducts : wishProducts;
  // isBag 변수는 선택된 필터가 bag인지 여부를 나타냅니다.
  const isBag = filter && filter === 'bag';

  return (
    <section className={styles.section}>
      <Header text='My Bags' />
      <ul className={styles.filters}>
        {filters &&
          filters.map((value, index) => (
            <li key={index}>
              <button
                className={`${styles.filter} ${
                  filter === value && styles.selected
                }`}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            </li>
          ))}
      </ul>
      <ul className={`${styles.content} ${!isBag && styles.grid}`}>
        {isBag && (
          <>
            <li className={styles.title}>
              <span></span>
              <span></span>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </li>
            {filtered.map((item) => (
              <BagItem key={item.id} product={item} />
            ))}
          </>
        )}
        {!isBag &&
          filtered.map((item) => <WishItem key={item.id} product={item} />)}
        {!filtered ||
          (filtered.length === 0 && (
            <p
              className={styles.fallback}
            >{`Your ${filter} is currently empty.`}</p>
          ))}
      </ul>
      {isBag && <OrderSummary />}
    </section>
  );
}
```

장바구니 탭에서는 사용자가 추가한 상품 목록이 표시되며, 사용자는 수량을 변경하거나 아이템을 삭제할 수 있습니다.

장바구니를 구현하기 위해 Firebase database에서 사용자의 id에 해당하는 장바구니 정보를 가져옵니다. `get` 함수를 호출하여 읽고자 하는 경로를 `ref`를 사용하여 명시하고, `Object.values`를 사용하여 해당 값만을 읽어옵니다.

```js
export async function getBag(userId) {
  return get(ref(database, `bags/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      return Object.values(items);
    });
}
```

장바구니와 관련된 쿼리 로직을 한 곳에서 관리하기 위해 useBag이라는 커스텀 훅을 만듭니다. 이렇게 하면 컴포넌트를 간결하게 유지하고, 캐싱된 데이터를 효율적으로 처리할 수 있습니다.

```jsx
export default function useBag() {
  // useAuthContext 훅을 사용해 사용자의 uid를 가져옵니다.
  const { uid } = useAuthContext();
  // 쿼리 클라이언트 객체를 생성하고, 쿼리를 관리합니다.
  const queryClient = useQueryClient();

  // 사용자 별로 캐시가 이루어지도록 쿼리 키로 uid를 사용합니다.
  // getBag 함수는 uid를 인자로 받아
  // 해당 사용자의 장바구니 데이터를 가져옵니다.
  // 사용자가 로그인 하지 않은 경우(uid가 falsy일 때),
  // 쿼리가 수행되지 않도록 enabled를 설정합니다.
  const bagQuery = useQuery(['bags', uid || ''], () => getBag(uid), {
    enabled: !!uid,
  });

  // addOrUpdateToBag는 uid와 product를 인자로 받아
  // 해당 사용자의 장바구니에 상품을 추가하거나 업데이트하는 함수입니다.
  // mutation이 성공적으로 완료되면 invalidateQueries를 통해
  // 데이터 쿼리를 다시 로드합니다.
  const addOrUpdateBagItem = useMutation(
    (product) => addOrUpdateToBag(uid, product),
    {
      onSuccess: () => queryClient.invalidateQueries(['bags', uid]),
    }
  );

  // removeFromBag 함수는 uid와 productId을 인자로 받아
  // 해당 사용자의 장바구니에서 특정 상품을 삭제합니다.
  // mutation이 성공적으로 완료되면 invalidateQueries를 통해
  // 데이터 쿼리를 다시 로드합니다.
  const removeBagItem = useMutation(
    (productId) => removeFromBag(uid, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bags', uid]);
      },
    }
  );

  // 장바구니 관련 데이터 및 기능을 반환합니다.
  return { bagQuery, addOrUpdateBagItem, removeBagItem };
}
```

### 4-6.1 Add item

![cvxv-add](https://github.com/cona-tus/react-online-store/assets/90844424/710c8307-652a-4fb1-ac2c-4b1473414a2b)

사용자가 상품 상세 페이지에서 'ADD TO BAG' 버튼을 클릭하면 Firebase database에 즉각적으로 반영되며, Navbar에서도 상품의 개수가 표시됩니다.

`addOrUpdateToBag` 함수는 uid와 추가/업데이트할 product를 인자로 받습니다. Firbase API의 `ref` 함수를 사용해 경로를 명시하고, `set` 함수로 데이터를 저장하거나 업데이트 합니다.

```js
export async function addOrUpdateToBag(userId, product) {
  return set(ref(database, `bags/${userId}/${product.id}`), product);
}
```

<br/>

### 4-6.2 Change quantity

![cvxv-quantity](https://github.com/cona-tus/react-online-store/assets/90844424/a2f05795-7c32-4edd-89fe-4a5f72cc1e26)

사용자는 추가한 상품의 `+` 또는 `-` 아이콘을 클릭하여 수량을 변경할 수 있습니다.

BagItem 컴포넌트는 MyBag 컴포넌트로부터 product를 props로 받아와 장바구니에 있는 개별 상품을 표시합니다. 수량을 변경하면 데이터가 변경된 것이므로 캐시를 업데이트합니다.

```jsx
export default function BagItem({
  product,
  product: { id, title, price, quantity, image },
}) {
  // 커스텀 훅에서 상품 추가/삭제 기능을 불러옵니다.
  const { addOrUpdateBagItem, removeBagItem } = useBag();

  // 리액트 라우터에서 제공하는 useNavigate 훅으로
  // 상품 이미지 클릭 시 페이지를 이동할 수 있도록 합니다.
  const navigate = useNavigate();

  // removeBagItem mutation 함수를 호출해 id를 인자로 넘기고
  // 해당 id와 일치하는 상품을 장바구니에서 삭제합니다.
  const handleRemove = () => {
    removeBagItem.mutate(id);
  };

  // handleMinus는 상품의 수량을 감소시키는 함수입니다.
  const handleMinus = () => {
    // 수량이 1 이하라면 리턴해주어 함수가 동작하지 않도록 합니다.
    if (quantity < 2) return;
    // 수량을 감소시킨 새로운 product 객체를 생성해
    // mutate 함수를 통해 전달하여 장바구니 데이터를 갱신합니다.
    addOrUpdateBagItem.mutate({ ...product, quantity: quantity - 1 });
  };

  // handlePlus는 상품의 수량을 증가시키는 함수입니다.
  const handlePlus = () => {
    // 수량을 증가시킨 새로운 product 객체를 생성해
    // mutate 함수를 통해 전달하여 장바구니 데이터를 갱신합니다.
    addOrUpdateBagItem.mutate({ ...product, quantity: quantity + 1 });
  };

  return (
    <li className={styles.item}>
      <Icon onClick={handleRemove} option='bag'>
        <VscChromeClose />
      </Icon>
      <div className={styles.image}>
        <img
          src={image}
          alt={title}
          onClick={() => {
            navigate(`/products/${id}`, {
              state: { product },
            });
          }}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.price}>{`₩ ${price.toLocaleString()}`}</p>
      <div className={styles.quantity}>
        <Icon onClick={handleMinus} option='bag'>
          <AiOutlineMinus />
        </Icon>
        <span className={styles.num}>{quantity}</span>
        <Icon onClick={handlePlus} option='bag'>
          <AiOutlinePlus />
        </Icon>
      </div>
      <p className={styles.subtotal}>{`₩ ${(
        price * quantity
      ).toLocaleString()}`}</p>
    </li>
  );
}
```

<br/>

### 4-6.3 Remove item

![cvxv-remove](https://github.com/cona-tus/react-online-store/assets/90844424/ddf82266-91a4-411a-937a-901d5b165fcb)

사용자는 `X` 버튼을 눌러 특정 상품을 장바구니에서 삭제할 수 있습니다.

Firebase database에서 `bags/${userId}/${productId}` 경로를 찾아 `remove` 함수로 상품 데이터를 삭제합니다.

```js
export async function removeFromBag(userId, productId) {
  return remove(ref(database, `bags/${userId}/${productId}`));
}
```

<br/>
<br/>

## 4-7. Wishlist

위시리스트 탭에서는 사용자가 저장한 위시 아이템이 나타납니다. 사용자는 상품 카트의 북마크 아이콘을 클릭해서 위시리스트에 상품을 추가하거나 삭제할 수 있습니다. 데이터 변경 시 Firebase Realtime Database에 실시간으로 반영됩니다.

`getWish`는 사용자의 위시리스트 데이터를 가져오는 함수입니다. `get` 함수를 호출하여 database의 `wish/${userId}`에 위치한 정보를 읽어옵니다. 데이터가 있다면 `Object.values`를 사용하여 해당 값만을 읽어옵니다.

```js
export async function getWish(userId) {
  return get(ref(database, `wish/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      return Object.values(items);
    });
}
```

useWish 커스텀 훅을 만들어 위시리스트 데이터를 관리합니다.

```jsx
export default function useWish() {
  // useAuthContext 커스텀 훅을 사용해 사용자 id를 가져옵니다.
  const { uid } = useAuthContext();

  // useQueryClient 훅으로 QueryClient를 가져옵니다.
  const queryClient = useQueryClient();

  // 사용자 별로 캐시가 이루어지도록 쿼리 키로 uid를 사용합니다.
  // getWish 함수는 uid를 인자로 받아
  // 해당 사용자의 위시리스트 데이터를 가져옵니다.
  // 사용자가 로그인 하지 않은 경우(uid가 falsy일 때),
  // 쿼리가 수행되지 않도록 enabled를 설정합니다.
  // 1분이 지나면 다시 데이터를 가져오도록 staleTime을 설정합니다.
  const wishQuery = useQuery(['wish', uid || ''], () => getWish(uid), {
    enabled: !!uid,
    staleTime: 1000 * 60,
  });

  // addOrUpdateTowish는 uid와 product를 인자로 받아
  // 사용자의 위시리스트에 상품을 추가하는 함수입니다.
  // mutation이 성공적으로 완료되면 invalidateQueries를 호출해
  // 데이터 쿼리를 다시 로드합니다.
  const addOrUpdateWishItem = useMutation(
    (product) => addOrUpdateTowish(uid, product),
    {
      onSuccess: () => queryClient.invalidateQueries(['wish', uid]),
    }
  );

  // removeFromWish 함수는 uid와 productId을 인자로 받아
  // 해당 사용자의 위시리스트에서 특정 상품을 삭제합니다.
  // mutation이 성공적으로 완료되면 invalidateQueries를 통해
  // 데이터 쿼리를 다시 로드합니다.
  const removeWishItem = useMutation(
    (productId) => removeFromWish(uid, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wish', uid]);
      },
    }
  );

  // 위시리스트 데이터, 추가/삭제 기능을 반환합니다.
  return { wishQuery, addOrUpdateWishItem, removeWishItem };
}
```

위시리스트에 상품을 추가하거나 삭제하는 작업은 ProductCard에서 이루어집니다. ProductCard는 product를 props로 받아서 상품 정보를 보여주는 컴포넌트입니다.

```jsx
export default function ProductCard({
  product,
  product: { id, image, title, price },
}) {
  // useAuthContext 커스텀 훅으로 사용자 정보와 로그인 기능을 가져옵니다.
  const { user, login } = useAuthContext();

  // useWish 커스텀 훅으로 위시리스트 데이터와 추가/삭제 기능을 가져옵니다.
  const {
    wishQuery: { isLoading: isLoadingWish, data: wishProducts },
    addOrUpdateWishItem,
    removeWishItem,
  } = useWish();

  // useState 훅으로 상품 id 배열을 저장합니다.
  const [wishId, setWishId] = useState([]);
  // 위시리스트에 상품/삭제 후 노출되는 메시지를 담는 상태입니다.
  const [success, setSuccess] = useState();
  // useNavigate 훅을 사용해 상품 이미지 클릭 시 해당 경로로 이동합니다.
  const navigate = useNavigate();

  // 상품이 위시리스트에 포함되어 있는지 여부를 나타냅니다.
  // 위시리스트에 포함되어 있다면
  // 채워진 북마크 아이콘 클릭 시 handleRemove 함수가 호출되고,
  // 포함되어 있지 않다면
  // 비어진 북마크 아이콘 클릭 시 hanleAdd 함수가 호출됩니다.
  const hasId = wishId && wishId.includes(id);

  // handleAdd는 위시리스트에 상품을 추가하는 함수입니다.
  const handleAdd = () => {
    // 사용자가 로그인되어 있는지 확인합니다.
    if (!user) {
      login();
      return;
    }

    // mutate를 호출해 product를 추가합니다.
    // 상품 추가가 성공적으로 이루어지면 메시지를 표시합니다.
    addOrUpdateWishItem.mutate(product, {
      onSuccess: () => {
        setSuccess('SAVING CHANGES');
        setTimeout(() => setSuccess(null), 1500);
      },
    });
  };

  // mutate를 호출해 product id에 해당하는
  // 상품을 위시리스트에서 삭제합니다.
  // 삭제가 성공적으로 이루어지면 메시지를 표시합니다.
  const handleRemove = () => {
    removeWishItem.mutate(id, {
      onSuccess: () => {
        setSuccess('SAVING CHANGES');
        setTimeout(() => setSuccess(null), 2000);
      },
    });
  };

  // useEffect 훅을 사용해 wishProducts가 변경될 때마다
  // 위시리스트에 있는 각 상품의 id를 추출하여
  // wishId 배열에 저장합니다.
  // 이렇게 하면 페이지 새로고침 시에도 저장된 위시 아이템을 기억합니다.
  useEffect(() => {
    const wishIds = wishProducts && wishProducts.map((item) => item.id);
    setWishId(wishIds);
  }, [wishProducts]);

  return (
    <>
      {isLoadingWish && <Modal text='Loading...' />}
      {success && <Modal text={success} />}
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
        <Icon onClick={hasId ? handleRemove : handleAdd} option='mark'>
          {hasId ? <BsBookmarkFill /> : <BsBookmark />}
        </Icon>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>{`₩ ${price.toLocaleString()}`}</p>
        </div>
      </li>
    </>
  );
}
```

### 4-7.1 Add item

![cvxv-wish-add](https://github.com/cona-tus/react-online-store/assets/90844424/cd1f342d-8d7b-40b5-a6f2-38e3424ceb88)

`addOrUpdateTowish` 함수는 userId 추가할 product를 인자로 받습니다. Firbase API의 `ref` 함수를 사용해 경로를 명시하고, `set` 함수로 데이터를 저장합니다.

```js
export async function addOrUpdateTowish(userId, product) {
  return set(ref(database, `wish/${userId}/${product.id}`), product);
}
```

<br/>

### 4-7.2 Remove item

![cvxv-wish-remove](https://github.com/cona-tus/react-online-store/assets/90844424/8704a869-f03e-4408-94e7-7594f32e1c38)

Firebase Realtime Database에서 `wish/${userId}/${productId}` 경로를 찾아 `remove` 함수로 상품 데이터를 삭제합니다.

```js
export async function removeFromWish(userId, productId) {
  return remove(ref(database, `wish/${userId}/${productId}`));
}
```

<br/>
<br/>

# 5. UI/UX

## 5-1. Sidebar

![cvxv-sidebar](https://github.com/cona-tus/react-online-store/assets/90844424/18bbc8f0-b0e1-4130-b61b-cd9881c64ff6)

Navbar의 메뉴 아이콘을 클릭하면 Sidebar가 나타나고, `x` 또는 바탕화면을 클릭하면 사이드바가 닫힙니다. `Sidebar` 컴포넌트에 사이드 바의 열림 상태(`isOpen`)와 닫힘 함수(`onClose`)를 props로 전달합니다.

```jsx
export default function Navbar() {
  // useState 훅을 사용해 사이드바의 상태를 관리합니다.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // useLocation 훅을 사용해 위치 정보를 가져옵니다.
  const location = useLocation();

  // 사이드바가 열리거나 닫힐 때 호출되는 함수입니다.
  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // useEffect 훅을 사용해 페이지 이동 시
  // 사이드바가 자동으로 닫히도록 만듭니다.
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

<Overlay /> 컴포넌트에서 `onClose` props를 받아 오버레이 클릭 시 사이드 바가 닫히도록 합니다.

```jsx
const Overlay = ({ onClose }) => {
  return <div className={styles.overlay} onClick={onClose}></div>;
};
```

`Sidebar` 컴포넌트는 사용자가 페이지 이동할 수 있는 링크 목록을 나타냅니다. 사이드바의 열림/닫힘 상태인 `isOpen`과 사이드바를 닫는 함수인 `onClose` 함수를 props로 받습니다.

```jsx
export default function Sidebar({ isOpen, onClose }) {
  // useAuthContext 커스텀 훅을 사용해
  // user 정보를 가져옵니다.
  // user가 어드민 계정이라면 Register을 렌더링합니다.
  const { user } = useAuthContext();

  // isOpen의 상태에 따라 클래스를 달리 적용합니다.
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

@media (max-width: 820px) {
  .container {
    width: 40%;
  }
}

@media (max-width: 680px) {
  .container {
    width: 90%;
  }
}
```

## 5-2. Responsive Web

CVXV 웹사이트는 반응형으로 디자인되어 각 디바이스에 맞춰진 최적화된 레이아웃과 사용자 경험을 제공합니다.

![cvxv-mobile01](https://github.com/cona-tus/react-online-store/assets/90844424/45a29a7d-5136-4d3b-8c2c-6215d7201f78)

![cvxv-mobile02](https://github.com/cona-tus/react-online-store/assets/90844424/c146c2e4-39df-44b0-a056-31e87d16799f)
