import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { v4 as uuid } from "uuid";

//firebaseConfig초기화는 프로젝트설정에 들어가면 있음
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// 로그인 시 계정 선택없이 바로 로그인 되는 현상이면 위 코드를 활용해보시면 좋을 것 같습니다.
provider.setCustomParameters({ prompt: "select_account" });

//로그인 (명령형함수)
export function login() {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
    })

    .catch((error) => console.error(error));
}

//로그아웃 (명령형함수)
export function logout() {
  signOut(auth).catch((error) => console.error(error));
}

//인증 상태 관찰자 설정이 변경되면 전달받은 callback함수 호출해주고 변경된 유저정보도 전달
//adminUser가 비동기 함수여서 async를 붙여줌
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    //1. 사용자가 있는 경우(로그인한 경우)
    //adminUser를 통해 업데이트된 사용자를 받아올때까지 기다렸다가 updatedUser에 할당
    const updatedUser = user ? await adminUser(user) : null;
    // console.log(user);
    callback(updatedUser);
  });
}

//read & write Data
//비동기 함수, 사용자가 어드민권한을 가지고 있는지 확인하고 해당정보를 포함한 사용자 객체를 반환.
async function adminUser(user) {
  //2. 사용자가 어드민 권한을 가지고 있는지 확인
  //3. {...user, isAdmin(추가): true/false}추가해서 객체 리턴
  return get(ref(database, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        //val()을 이용해 value를 읽어온다
        const admins = snapshot.val();
        // console.log(admins);
        //admin있는지 확인: includes()
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
      // admin이 없으면 user 리턴 (admin이 없는걸로 간주)
      return user;
    });
}

//제품관련등록
//제품정보인 product와 image을 받아온다.
//firebase에서 데이터를 읽을땐 get, 쓸때는 set
export async function addNewProduct(product, image) {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    options: product.options.split(","),
  });
}

//모든 제품 가져오기
export async function getProducts() {
  return get(ref(database, "products")).then((snapshot) => {
    if (snapshot.exists()) {
      //Object.values: value값만 가져오고싶을때
      return Object.values(snapshot.val());
    }
    //snapshot이 없다면 빈배열 리턴
    return [];
  });
}

//쇼핑카트 (사용자아이디별로 쇼핑카트보여주기)
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)) //
    .then((snapshot) => {
      //val을 이용해 데이터를 읽어오고 없다면 객체리턴
      const items = snapshot.val() || {};
      // console.log(items);
      return Object.values(items);
    });
}

//쇼핑카트 추가 또는 업뎃
export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
}

//쇼핑카트 삭제
export async function removeFromCart(userId, productId) {
  return remove(ref(database, `carts/${userId}/${productId}`));
}
