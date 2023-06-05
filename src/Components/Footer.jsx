import React from "react";
import styled from "@emotion/styled";
import Logo from "./Logo";

const FooterContainer = styled("footer")`
  /* position: static; */
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f9ffcd;
  color: #414141;
  padding: 2vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const FooterText = styled("div")`
  font-size: 1.6vh;
  margin-top: 1vh;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Logo />
      <FooterText>&copy; 2023. My Website. All Rights Reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;
