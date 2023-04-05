import { useState } from "react";
import "./index.css";
import axios from "axios";
import { Notification } from "../Notification";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [data, setData] = useState({ login: "", password: "" });
  const [notif, setNotif] = useState(false);
  const navigate = useNavigate();
  const fillFields = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const userLogin = () => {
    localStorage.setItem("user_type", "user");
    navigate("/");
  };

  const login = () => {
    console.log("Login", data);
    axios
      .post(
        "http://localhost:8000/login",
        { data },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("Admin has been authenticated successfully. Celebrate!");
          localStorage.setItem("user_type", "admin");
          navigate("/");
        } 
        else
        {
          console.log("STATUS IS NOT 200!");
        }
      })
      .catch(() => {
        setNotif(true);
        const tm = setTimeout(() => {
          setNotif(false);
          clearTimeout(tm);
        }, 1500);
      });
  };

  return (
    <div className="Auth">
      {notif && <Notification />}
      <form>
        <div className="form-group">
          <label>Email address</label>
          <input
            name="login"
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={fillFields}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={fillFields}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={login}>
          Login
        </button>
        <button type="button" className="btn btn-outline-info ml-3" onClick={userLogin}>
          Guest Enter
        </button>
      </form>
    </div>
  );
};
