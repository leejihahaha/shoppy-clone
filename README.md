# 에러모음- 쇼핑몰 클론코딩

1. Warning: Each child in a list should have a unique "key" prop.
Check the render method of `Products`.

**경고: 목록에 있는 각 아이는 고유한 "키" 소품을 가지고 있어야 합니다. 'Products'의 렌더 방식을 확인하세요.**

![K-002.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/42a7be0a-2649-478a-bbda-55b97a636cb1/e94d8771-ab1c-4e5a-b243-86924e41b672/K-002.jpg)

React에서 이러한 경고가 발생하는 경우는 각 항목이 고유한 "key" 속성을 가지지 않았을 때입니다. "key" 속성은 React가 리스트 내에서 변경된 항목을 식별하고 효율적인 다시 렌더링을 도와주는 역할을 합니다.

![K-003.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/42a7be0a-2649-478a-bbda-55b97a636cb1/c10cc494-6f14-4abe-89f5-5493a05fbec2/K-003.jpg)

key로 입력해줘야하는데 id로 입력하는 바람에 저런 에러가 떴다!

key로 수정했더니 바로 에러 해결…(머쓱)

1. 파이어베이스에서 items 확인하려고했는데 빈객체만 보였다.

cartstatus 컴포넌트에서 uid를 전달하지 않아서 였다!

![K-001.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/42a7be0a-2649-478a-bbda-55b97a636cb1/ee7ad38c-19aa-4215-ab82-ab2923cefddb/K-001.jpg)

```jsx
export default function CartStatus() {
  **const { uid } = useAuthContext();**
  const { data: products } = useQuery({
    queryKey: ["carts"],
    queryFn: () => **getCart(uid)**,
  });
```

```jsx
//쇼핑카트 (사용자아이디별로 쇼핑카트보여주기)
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)).then((snapshot) => {
    //val을 이용해 데이터를 읽어오고 없다면 객체리턴
    const items = snapshot.val() || {};
    console.log(items);
    return Object.values(items);
  });
}
```

1. (해결) 분명 로그인을 했는데 연필 아이콘이 안보인다!!!!!→ firebase realtime database에 저장된 uid가 달라서 였다!

시도→ products/new url을 쳐봐도 ProtectedRoute컴포넌트로 인해 홈으로 리다이렉트가 된다.

분명 사용자가 어드민 권한을 가지고 있으면 리다이렉트가 안될텐데 된다는 것에 대해 의구심을 품었고 admins의 저장된 uid를 확인해보기로 했다.

결과,  firebase realtime database에 저장된 uid가 달라서 였다! 왜 다른 uid가 저장이 됐는지는 모르겠지만…..

![K-001.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/42a7be0a-2649-478a-bbda-55b97a636cb1/44d4f4d2-7a49-4258-b5ef-1be9921522d9/K-001.jpg)

firebase.js 파일에서 console.log(user)로 uid를 확인해보자  출력된 uid 를 firebase realtime database에 admins에 {0: 값} 복붙하면 된다.

```jsx
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    //1. 사용자가 있는 경우(로그인한 경우)
    //adminUser를 통해 업데이트된 사용자를 받아올때까지 기다렸다가 updatedUser에 할당
    const updatedUser = user ? await adminUser(user) : null;
    // console.log(user);
    callback(updatedUser);
  });
}
```

**4.*Uncaught TypeError: this[#client].defaultMutationOptions is not a function***

useMutation 쓰는 법이 잘못되었기 때문!

수정전

```jsx
const removeItem = useMutation((id) => removeFromCart(uid, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['carts', uid]);
    },
  });

  return { cartQuery, addOrUpdateItem, removeItem };
}
```

[Mutations | TanStack Query Docs](https://tanstack.com/query/v4/docs/react/guides/mutations)

수정후   **mutationFn→추가!**

**`product`**가 객체에 포장되어야 하는지 여부는 **`mutationFn`**이 처리하려는 데이터의 예상 구조에 따라 결정됩니다.

```jsx
const removeItem = useMutation({
    **mutationFn:** (id) => removeFromCart(uid, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["carts", uid]);
    },
  });

  return { cartQuery, addOrUpdateItem, removeItem };
}
```

1. 마이너스 플러스버튼을 누르면 숫자가 증가해야하는데 증가,감소가 안먹힘!
    
    ![K-001.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/42a7be0a-2649-478a-bbda-55b97a636cb1/9f0cc5c3-6783-456b-9bef-25a059fe33e6/K-001.jpg)
    
    useCart.jsx 에서 product를 객체로 감쌌기 때문에!
    
    ```jsx
     const addOrUpdateItem = useMutation({
        mutationFn: ({ product }) => addOrUpdateToCart(uid, product),
    ```
    
    ![K-003.jpg](https://prod-files-secure.s3.us-west-2.amazonaws.com/42a7be0a-2649-478a-bbda-55b97a636cb1/4c912186-40ef-48c4-97b8-176e49962ad8/K-003.jpg)
    
    1. productDetail에서 mutate 수정해도 즉각적인 변화가 없어서 도대체 무슨문제지 해서 firebase 에 들어갔다가 다시 해보니 됐다…?
