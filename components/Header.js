import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const Container = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0px;
`;

const Username = styled.h4`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 23px;
  color: #323b4b;
`;

const Invert = styled.div`
  color: #b0b7c3;
`;

const Logout = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
`;

const LogoutIcon = styled.img``;

const Header = ({ user }) => {
  const router = useRouter();

  function logout() {
    const authToken = document.cookie.match(
      "(^|;)\\s*authToken\\s*=\\s*([^;]+)"
    );

    if (authToken) {
      // delete the auth cookies
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect user to sign-in page
      router.push("/");
    }
  }

  return (
    <Container>
      <Username>
        Hi, &nbsp; {user && user.name} <br />
        <Invert>Welcome back!</Invert>
      </Username>

      <Logout>
        <LogoutIcon src="/images/logout-icon.svg" onClick={logout} />
      </Logout>
    </Container>
  );
};

export default Header;
