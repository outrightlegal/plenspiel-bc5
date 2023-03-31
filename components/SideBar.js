import React from "react";
import styled from "styled-components";
import Link from "next/link";

const SideBar = styled.div`
  width: 20%;
  height: 100vh;
  padding-left: 18px;
  border-right: 1px solid #f3f3f3;
`;

const Logo = styled.img`
  padding-top: 35px;
  display: block;
  margin: 0 auto;
  margin-bottom: 54px;
`;

const Navigation = styled.ul``;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding-left: 18px;
  width: 100%;
  height: 46px;
  cursor: pointer;
  margin-bottom: 5px;
  border-radius: 15px 0px 0px 15px;
  transition: 0.3s ease-in-out;

  &:hover {
    background: rgba(209, 192, 255, 0.44);
  }
`;

const NavIcon = styled.img`
  margin-right: 10px;
`;

const NavText = styled.p`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 29px;
  color:color: #8A94A6;

  &:hover {
    color: #8053ff;
  }

`;

const Sidebar = () => {
  return (
    <SideBar>
      <Logo src="/images/logo.svg" />
      <Navigation>
        <NavItem href="/dashboard">
          <NavIcon src="/images/dashboard-icon.svg" />
          <NavText>Dashboard</NavText>
        </NavItem>
        <NavItem href="/manage-copyrights">
          <NavIcon src="/images/manage-copyright-icon.svg" />
          <NavText>Manage Copyrights</NavText>
        </NavItem>
        <NavItem href="/more-services">
          <NavIcon src="/images/more-services-icon.svg" />
          <NavText>More Services</NavText>
        </NavItem>
        <NavItem href="/faq">
          <NavIcon src="/images/faq-icon.svg" />
          <NavText>FAQ</NavText>
        </NavItem>
        <NavItem href="/profile">
          <NavIcon src="/images/profile-icon.svg" />
          <NavText>Profile</NavText>
        </NavItem>
      </Navigation>
    </SideBar>
  );
};

export default Sidebar;
