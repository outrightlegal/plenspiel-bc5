import React, { useState, useEffect } from "react";

import {
  Container,
  SideBar,
  MainArea,
  Wrapper,
  Logo,
  Navigation,
  NavItem,
  NavIcon,
  NavText,
  Header,
  Username,
  Invert,
  Logout,
  LogoutIcon,
  RegisteredBooks,
  Books,
  Title,
  Form,
  InputWrapper,
  SubmitButton,
} from "../../styles/addbook.elements";

import { useRouter } from "next/router";

import InputFieldD from "@/components/InputFieldD";

const Index = () => {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    bookTitle: "",
    bookEdition: "",
    authorName: "",
    dob: "",
    isbn: "",
    country: "",
    yop: "",
    publisher: "",
    website: "",
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

  const { email, name } = formData;

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //Get authToken form cookie
    const authToken = document.cookie.authToken;

    // Verify the token

    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    // Check if the token is valid
    if (!decodedToken || !decodedToken.id) {
      router.push("/signin");
    }

    const token = document.cookie.authToken;

    const response = await fetch("/api/addbook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Signup was successful, redirect the user to the dashboard
      const data = await response.json();

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
      <SideBar>
        <Logo src="/images/logo.svg" />
        <Navigation>
          <NavItem href="/dashboard">
            <NavIcon src="/images/dashboard-icon.svg" />
            <NavText>Dashboard</NavText>
          </NavItem>
          <NavItem href="/signup">
            <NavIcon src="/images/manage-copyright-icon.svg" />
            <NavText>Manage Copyrights</NavText>
          </NavItem>
          <NavItem href="/signup">
            <NavIcon src="/images/more-services-icon.svg" />
            <NavText>More Services</NavText>
          </NavItem>
          <NavItem href="/signup">
            <NavIcon src="/images/faq-icon.svg" />
            <NavText>FAQ</NavText>
          </NavItem>
          <NavItem href="/signup">
            <NavIcon src="/images/profile-icon.svg" />
            <NavText>Profile</NavText>
          </NavItem>
        </Navigation>
      </SideBar>

      <MainArea>
        <Header>
          <Username>
            Hi, John Doe <br />
            <Invert>Welcome back!</Invert>
          </Username>

          <Logout>
            <LogoutIcon src="/images/logout-icon.svg" />
          </Logout>
        </Header>
        <Wrapper>
          <RegisteredBooks>
            <Books>
              <Title>Add New Book</Title>
              <Form onSubmit={handleFormSubmit}>
                <InputWrapper>
                  <InputFieldD
                    name="bookTitle"
                    label={"Book Title"}
                    type={"text"}
                    onChange={handleChange}
                  />
                  <InputFieldD
                    name="bookEdition"
                    label={"Book Edition"}
                    type={"text"}
                    onChange={handleChange}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputFieldD
                    name="authorName"
                    label={"Author Name"}
                    type={"text"}
                    onChange={handleChange}
                  />
                  <InputFieldD
                    name="dob"
                    label={"Date of Birth"}
                    type={"date"}
                    onChange={handleChange}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputFieldD
                    name="isbn"
                    label={"ISBN Number"}
                    type={"text"}
                    onChange={handleChange}
                  />
                  <InputFieldD
                    name="country"
                    label={"Country/Origin"}
                    type={"text"}
                    onChange={handleChange}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputFieldD
                    name="yop"
                    label={"Year of publication"}
                    type={"text"}
                    onChange={handleChange}
                  />
                  <InputFieldD
                    name="publisher"
                    label={"Publisher"}
                    type={"text"}
                    onChange={handleChange}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputFieldD
                    name="website"
                    label={"Your Website"}
                    type={"url"}
                    fullWidth={true}
                    onChange={handleChange}
                  />
                </InputWrapper>

                <SubmitButton
                  type="submit"
                  value="ADD NOW"
                  name="submit"
                  disabled={disabled}
                />
              </Form>
            </Books>
          </RegisteredBooks>
        </Wrapper>
      </MainArea>
    </Container>
  );
};

export default React.memo(Index);
