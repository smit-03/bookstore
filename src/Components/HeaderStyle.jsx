import { styled } from "@mui/material";
import { Typography, Button } from "@mui/material";

export const HeaderContainer = styled("header")`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: red;
  color: white;
  display: flex;
  align-items: center;
  z-index: 999;
  width: 100vw;
`;

export const Title = styled(Typography)`
  font-weight: bold;
  margin-right: 3vw;
`;

export const SigninButton = styled(Button)`
  background-color: white;
  color: black;
  margin-left: 1vw;
  text-transform: capitalize;
  font-family: "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji";
  :hover {
    background-color: wheat;
  }
`;

export const CounteItem = styled("span")`
  position: relative;
  vertical-align: super;
  font-size: 0.96rem;
  line-height: 0.8;
  top: -0.5em;
`;

export const ResultContainer = styled("div")`
  position: absolute;
  top: 0;
`;

export const NavigationLinksContainer = styled("div")`
  justify-content: left;
`;

export const NavigationButton = styled(Button)`
  && {
    margin-right: 8px;
  }
`;
