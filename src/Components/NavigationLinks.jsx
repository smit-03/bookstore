import React from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { NavigationLinksContainer, NavigationButton } from "./HeaderStyle";

const NavigationLinks = () => {
  return (
    <NavigationLinksContainer>
      <NavigationButton color="inherit" component={Link} to={RoutePaths.home}>
        Home
      </NavigationButton>
      <NavigationButton color="inherit" component={Link} to={RoutePaths.about}>
        About
      </NavigationButton>
      <NavigationButton
        color="inherit"
        component={Link}
        to={RoutePaths.contact}
      >
        Contact
      </NavigationButton>
    </NavigationLinksContainer>
  );
};

export default NavigationLinks;
