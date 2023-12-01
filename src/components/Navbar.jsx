import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import User from "./User";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import CartStatus from "./CartStatus";

//로그인관련된 모든 상태
export default function Navbar() {
  const { user, login, logout } = useAuthContext();

  return (
    <header className="flex justify-between p-2 border-b border-gray-300">
      <Link className="flex items-center text-4xl text-brand" to="/">
        <FiShoppingBag />
        <h1>Shoppy</h1>
      </Link>

      <nav className="flex items-center gap-4 font-semibold">
        <Link to="/products">Products</Link>
        {user && (
          <Link to="/carts">
            <CartStatus />
          </Link>
        )}

        {/* 사용자가 어드민인 경우에만 연필아이콘을 보여주고싶을때 */}
        {/* isAdmin:firebase */}
        {user && user.isAdmin && (
          <Link to="/products/new" className="text-2xl">
            <BsFillPencilFill />
          </Link>
        )}
        {user && <User user={user} />}
        {/* 사용자의 유무에 따라 버튼을 보여주기 */}
        {!user && <Button text={"Login"} onClick={login} />}
        {user && <Button text={"Logout"} onClick={logout} />}
      </nav>
    </header>
  );
}
