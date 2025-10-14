import "./Header.css";
import { ManagerContext } from "../../context/ManagerContext";
import { useContext } from "react";

export default function Header() {
  const { staff } = useContext(ManagerContext);
  return (
    <div className="header">
      <img src="/logo3.png" alt="Logo" className="logo" />
      <div className="account">
        <img className="profile" src="/profile.jpg" alt="profile"></img>
        <span>{staff?.fullname}</span>
      </div>
      {/* Placeholder with letter */}
    </div>
  );
}
