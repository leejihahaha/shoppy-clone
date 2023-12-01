import React from "react";

export default function User({ user: { photoURL, displayName } }) {
  return (
    //shrink-0:  이미지 줄어들지 않게 설정,
    // flex 박스에 들어있는 자식요소들에만 적용이 가능
    <div className="flex items-center shrink-0">
      <img
        className="w-10 h-10 rounded-full mr-2"
        src={photoURL}
        alt={displayName}
        referrerPolicy="no-referrer"
      />
      <span className="hidden md:block">{displayName}</span>
    </div>
  );
}
