import { styled } from "@mui/system";
import { Typography, Button } from "@mui/material";

export const HeaderContainer = styled("header")`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  color: #fdfff1;
  display: flex;
  align-items: center;
  z-index: 999;
  width: 100vw;
  opacity: 0.9;
`;

export const Title = styled(Typography)`
  font-weight: bold;
  margin-right: 1.5vw;
`;

export const SLOButton = styled(Button)`
  background-color: #fdfff1;
  color: black;
  margin-left: 1vw;
  margin-right: 0.5vw;
  text-transform: capitalize;
  font-family: "Apple Color Emoji", "Segoe UI Emoji";
  font-weight: 600;
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
  text-transform: capitalize;
`;
