import React, { useState } from "react";
import Button from "../components/ui/Button";
import { uploadImage } from "../api/uploader";
import useProducts from "../hooks/useProducts";
import { Link } from "react-router-dom";

export default function NewProduct() {
  //사용자가 입력한 데이터를 담음 product, setProduct
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();
  const { addProduct } = useProducts();

  const handleChange = (e) => {
    const { value, name, files } = e.target;
    if (name === "file") {
      //이름이 file인 경우에만 파일은 set해주고
      setFile(files && files[0]);
      console.log(files[0]);
      return;
    }
    // 이름이 file인 아닌경우에는
    setProduct((product) => ({ ...product, [name]: value }));
    // console.log(product);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    //제품의 사진을 cloudinary에 업로드하고 url을 획득
    uploadImage(file) //
      .then((url) => {
        addProduct.mutate(
          { product, url },
          {
            onSuccess: () => {
              setSuccess("성공적으로 제품이 추가되었습니다.");
              setTimeout(() => {
                setSuccess(null);
              }, 4000);
            },
          }
        );
        // console.log(url);
        //firebase에 새로운 제품을 추가함.
      })
      .finally(() => setIsUploading(false));
  };
  return (
    <section className="w-full text-center">
      <div className="w-full flex-col mt-5">
        <Link to="/">
          <button type="button">◀ 홈으로 가기</button>
        </Link>
        <h2 className="text-2xl font-bold my-4">새로운 제품 등록</h2>
      </div>
      {success && <p className="my-2">✅{success}</p>}
      {/* 파일이 있다면 선택된 파일을 url로 전달 */}
      {file && (
        <img
          className="w-96 mx-auto mb-2"
          src={URL.createObjectURL(file)}
          alt="local file"
        />
      )}
      <form className="flex flex-col px-12" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          name="file"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="title"
          value={product.title ?? ""}
          placeholder="제품명"
          required
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          value={product.price ?? ""}
          placeholder="가격"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          value={product.category ?? ""}
          placeholder="카테고리"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          value={product.description ?? ""}
          placeholder="제품 설명"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="options"
          value={product.options ?? ""}
          placeholder="옵션들(콤마(,)로 구분)"
          required
          onChange={handleChange}
        />
        <Button
          text={isUploading ? "업로드중..." : "제품 등록하기"}
          disabled={isUploading}
        />
      </form>
    </section>
  );
}
