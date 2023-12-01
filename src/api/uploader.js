//선택된 파일을 전달해주면 알아서 업로드, 업로드된 url을 리턴
export async function uploadImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    //post메소드로 바로 업로드
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => data.url);
}
