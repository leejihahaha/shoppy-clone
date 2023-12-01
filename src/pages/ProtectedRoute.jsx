import { Navigate } from "react-router-dom";
import React from "react";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin }) {
  //로그인한 사용자가 있는지 확인
  //그 사용자가 어드민 권한이 있는지 확인
  const { user } = useAuthContext();

  //requireAdmin이 true인 경우에는 로그인도, 어드민권한도 가지고 있어야함
  //조건에 맞지않으면 상위 경로로 이동!
  if (!user || (requireAdmin && !user.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  //조건에 맞는 경우에만 전달된(해당 페이지 컴포넌트) children을 보여줌
  return children;
}
