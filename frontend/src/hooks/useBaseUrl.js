// useBaseUrl.js
import { useState, useEffect } from "react";

const useBaseUrl = () => {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    const determineBaseUrl = () => {
      if (window.location.hostname === "localhost") {
        setBaseUrl("http://localhost:3001/api"); // Or your local backend URL
      } else {
        setBaseUrl(process.env.REACT_APP_BACKEND_URL); // Use the .env variable
      }
    };

    determineBaseUrl();
  }, [setBaseUrl, window.location.hostname]); // Dependency array

  return baseUrl;
};

export default useBaseUrl;