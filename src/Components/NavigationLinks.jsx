import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { NavigationLinksContainer, NavigationButton } from "./HeaderStyle";
import shared from "../utils/shared";
import { useAuthContext } from "../context/auth.context";

const NavigationLinks = () => {
  const authContext = useAuthContext();
  const items = useMemo(() => {
    return shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, []);
  return (
    <NavigationLinksContainer>
      {!authContext.user.id && (
        <NavigationButton
          color="inherit"
          component={Link}
          to={RoutePaths.login}
          style={{
            fontSize: "1rem",
            fontFamily: "Georgia, serif",
            textTransform: "capitalize",
          }}
        >
          Login
        </NavigationButton>
      )}
      {items.map((item) => (
        <NavigationButton color="inherit" component={Link} to={item.route}>
          {item.name}
        </NavigationButton>
      ))}
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
