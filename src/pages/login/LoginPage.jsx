import { useContext, useState } from "react";
import "./LoginPage.css";
import Header from "../../components/header/Header";
import { ManagerContext } from "../../context/ManagerContext";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setStaff, notifySuccess, notifyError, BASE_URL } =
    useContext(ManagerContext);
  const url = `${BASE_URL}/users`;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        notifyError(`All fields are required`);
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        notifyError("Email is not valid!");
        return;
      }

      const response = await axios.post(`${url}/login/staff`, {
        email,
        password,
      });

      if (response.status === 200) {
        if (response.data !== false) {
          if (response.data.staff.usertype !== 2) {
            setPassword("");
            setEmail("");
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("staff", JSON.stringify(response.data.staff));
            //setUserData(response.data.user);
            // alert(
            //   `Welcome ${response.data.staff.fullname} , usertype: ${response.data.staff.usertype}`
            // );
            setIsLoggedIn(true);
            setStaff(response.data.staff);
          } else {
            notifyError("Login Deniad, you need to be a staff to login");
          }
        } else {
          notifyError("Wrong email or password");
        }
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Something went wrong while logging in");
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button type="submit">Login</button>
            {/* <a>Forgot password?</a> */}
          </form>
        </div>
      </div>
    </>
  );
}
