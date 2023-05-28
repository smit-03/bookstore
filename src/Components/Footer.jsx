import React from "react";
import logo from "../assets/images/logo.svg";
import styled from "@emotion/styled";

const FooterContainer = styled("footer")`
  /* position: static; */
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #212121;
  color: white;
  padding: 2vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const LogoImage = styled("img")`
  height: 5vh;
  width: auto;
`;

const FooterText = styled("div")`
  font-size: 1.6vh;
  margin-top: 1vh;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <LogoImage src={logo} alt="SMIT PATIVALA" />
      <FooterText>&copy; 2023. My Website. All Rights Reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;
