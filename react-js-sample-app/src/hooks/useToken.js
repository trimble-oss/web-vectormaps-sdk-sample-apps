import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { processLicense } from "../Utils/processLicense";
import { constants } from "../Utils/constants";

function useToken(apiKey) {
  const [jwtToken, setJwtToken] = useState({});
  const [error, setError] = useState(null);

  let requestBody = {
    apiKey: apiKey,
  };
  useEffect(() => {
    if (apiKey) {
      fetch(constants.AUTH_WS_URL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then(
          (authToken) => {
            if (authToken.token) {
              const decoded = jwtDecode(authToken.token);
              const license = processLicense(decoded.features);
              setJwtToken(license);
              setError(null);
            } else {
              setError("There is an Error!");
            }
          },
          (err) => {
            console.error("Error fetching token:", err);
            setError("There is an Error!");
          }
        );
    }
  }, [apiKey]);
  return { jwtToken, error };
}

export default useToken;
