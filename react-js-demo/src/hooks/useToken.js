import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { processLicense } from "../Utils/processLicense";
import { constants } from "../Utils/constants";

function useToken(apiKey) {
  const [data, setData] = useState({});

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
        .then((authToken) => {
          const decoded = jwtDecode(authToken.token);
          const license = processLicense(decoded.features);
          setData(license);
        });
    }
  }, [apiKey]);
  return data;
}

export default useToken;
