import { Form } from "react-bootstrap";
import classes from "./Signin.module.scss";
import { useContext, useRef, useState } from "react";
import { signin } from "../../axios/auth";
import Button from "../../components/Button/Button";
import UserContext from "../../store/User";

const Signin = () => {
  const user = useContext(UserContext);

  const [submiting, setSubmiting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const usernameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  function submitLogin() {
    signin(usernameRef.current.value, passwordRef.current.value)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        user.actions.login({ access_token: res.data.token });
      })
      .catch((err) => {
        setSubmiting(false);
        setError(err.response?.data?.message || "Por favor tente mais tarde");
      });
  }

  return (
    <div className={classes.main}>
      <div className="col-10 col-md-6 col-lg-4 col-xl-3 col-xxl-2">
        <p className="text-align-center fs-5 text-white fw-bold">Signin</p>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmiting(true);
            submitLogin();
          }}
          className={classes.form}
        >
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Nome de utilizador</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Introduza o seu nome de utilizador"
              ref={usernameRef}
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="Introduza a sua password"
              ref={passwordRef}
            />
          </Form.Group>
          {error ? (
            <p
              className="text-align-center fw-semibold"
              style={{ color: "red" }}
            >
              {error}
            </p>
          ) : null}
          <div className="d-flex justify-content-center">
            <Button loading={submiting} submit>
              Entrar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
