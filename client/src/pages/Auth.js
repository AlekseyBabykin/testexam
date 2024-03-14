import React, { useEffect, useState } from "react";
import { Card, Button, Form, Container } from "react-bootstrap";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { BUSINESSPAGE_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE } from "../utils/const";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSignIn,
  fetchSignUp,
  selectLoading,
} from "../features/Users/apiSlice";
import { fetchCompanyInfo } from "../features/Business/apiSliceBusiness";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const isLogin = location.pathname === SIGNIN_ROUTE;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  const click = async () => {
    try {
      let response;
      if (isLogin) {
        response = await dispatch(fetchSignIn({ email, password }));
      } else {
        response = await dispatch(fetchSignUp({ email, password }));
      }
      if (!loading) {
        console.log("Token after login/signup:", localStorage.getItem("token"));
        navigate(BUSINESSPAGE_ROUTE);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54, backgroundColor: "grey" }}
    >
      <Card style={{ width: "600px" }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Login" : "Registration"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-4"
            type="email"
            placeholder="write your Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-4"
            type="password"
            placeholder="write your Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="d-flex  justify-content-between mt-4">
            {isLogin ? (
              <div>
                no account? <NavLink to={SIGNUP_ROUTE}>Registration</NavLink>
              </div>
            ) : (
              <div>
                account exist? <NavLink to={SIGNIN_ROUTE}>apply</NavLink>
              </div>
            )}
            <Button variant={"outline-success"} onClick={click}>
              {isLogin ? "Apply" : "Registration"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Auth;
