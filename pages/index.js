import React, { useState } from "react";
import styled from "styled-components";
import jwt from "jsonwebtoken";

import InputField from "@/components/InputField";
import { useRouter } from "next/router";

const Container = styled.div`
  max-width: 1440px;
  width: 100%;
  height: 100vh;
  display: flex;
  margin: 0 auto;
`;

const SideBar = styled.div`
  width: 40%;
  height: 100vh;
  background: url("/images/signup-img.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const MainArea = styled.div`
  width: 60%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-height: 588px;
  width: 440px;
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h1`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  line-height: 29px;
  color: #323b4b;
  margin-bottom: 10px;
`;

const SubHeading = styled.h4`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 29px;
  color: #8a94a6;
  margin-bottom: 42px;
`;

const Form = styled.form``;

const PasswordFill = styled.div`

  max-width: 90%;
  width: ${({ password }) => password.length * 10}%};
  height: 2px;
  background: ${({ password }) =>
    password.length > 6 ? "#38CB89" : "#FF5630"};
  border-radius: 15px;
  margin: 0 20px;
  margin-bottom: 20px;
  transition: width 0.5s ease-in-out;
`;

const index = () => {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    const isFormValid = Object.values(formData).every((value) => value);

    if (isFormValid) {
      setDisabled(false);
    }
  };

  const { email, password } = formData;

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      //save auth token in cookie
      document.cookie = `authToken=${data.token}`;
      document.cookie = `loggedInUser=${JSON.stringify(data.user)}`;

      // Login was successful, redirect the user to the dashboard
      router.push("/dashboard");
    } else {
      // Login failed, display an error message to the user
      const data = await response.json();
      console.error(data.message);
    }
  };

  return (
    <Container>
      <SideBar></SideBar>
      <MainArea>
        <Wrapper>
          <Heading>Getting Started</Heading>
          <SubHeading>Create an account to continue!</SubHeading>

          <Form onSubmit={handleFormSubmit}>
            <InputField
              name={"email"}
              type={"email"}
              placeholder={"Your Email"}
              value={email}
              handleChange={handleChange}
            />

            <InputField
              name={"password"}
              type={"password"}
              placeholder={"Create Password"}
              value={password}
              handleChange={handleChange}
            />

            <InputField name={"Sign In"} type={"submit"} disabled={disabled} />
          </Form>
        </Wrapper>
      </MainArea>
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.cookies.authToken;

  if (token) {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken && !verifyToken.id) {
      res.writeHead(302, { Location: "/" });
      res.end();
    } else {
      res.writeHead(302, { Location: "/dashboard" });
      res.end();
    }
  }

  return {
    props: {},
  };
};

export default index;
