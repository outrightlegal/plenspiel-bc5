import React, { useState, useEffect } from "react";
import {
  Container,
  SideBar,
  MainArea,
  Wrapper,
  Heading,
  SubHeading,
  Form,
  PasswordFill,
} from "../../styles/signup.elements";

import InputField from "@/components/InputField";
import { useRouter } from "next/router";

const index = () => {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    const isFormValid = Object.values(formData).every((value) => value);

    if (isFormValid && password.length >= 6) {
      console.log("Form is valid");
      setDisabled(false);
    }
  };

  const { email, name, password } = formData;

  useEffect(() => {
    // Check if auth token exists in local storage
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
      return;
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if auth token is already stored in local storage
    if (localStorage.getItem("authToken")) {
      console.log("User already logged in, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Signup was successful, redirect the user to the dashboard
      const data = await response.json();

      // Store auth token in local storage
      localStorage.setItem("authToken", data.token);

      console.log(data);
      router.push("/dashboard");
    } else {
      // Signup failed, display an error message to the user
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
              name={"name"}
              type={"text"}
              placeholder={"Your Name"}
              value={name}
              handleChange={handleChange}
            />
            <InputField
              name={"password"}
              type={"password"}
              placeholder={"Create Password"}
              handleChange={handleChange}
            />
            <PasswordFill password={password} />
            <InputField name={"Sign Up"} type={"submit"} disabled={disabled} />
          </Form>
        </Wrapper>
      </MainArea>
    </Container>
  );
};

export default index;
