import React from "react";
import { ErrorContainer, ErrorTitle, ErrorSubtitle } from "../../style";
const Error = () => {
  return (
    <ErrorContainer>
      <ErrorTitle>404</ErrorTitle>
      <ErrorSubtitle>Page Not Found!!</ErrorSubtitle>
      <p>Oops! The page you are looking for does not exist. </p>
    </ErrorContainer>
  );
};

export default Error;
