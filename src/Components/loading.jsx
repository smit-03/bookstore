import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const withLoading = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(false);

    const startLoading = () => {
      setLoading(true);
    };

    const stopLoading = () => {
      setLoading(false);
    };

    return (
      <>
        {loading && <CircularProgress />}
        <WrappedComponent
          {...props}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      </>
    );
  };
};

export default withLoading;
