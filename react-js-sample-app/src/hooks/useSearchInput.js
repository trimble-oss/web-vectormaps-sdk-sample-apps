import { useEffect, useState } from "react";
import { constants } from "../Utils/constants";

function useSearchInput(input, searchRegion, apiKey) {
  const [data, setData] = useState({});
  const queryParams = new URLSearchParams();
  queryParams.append("authToken", apiKey);
  queryParams.append("query", input);
  queryParams.append("maxResults", 5);
  useEffect(() => {
    if (input.length >= 1) {
      fetch(
        ` ${constants.SINGLE_SEARCH_URL}${searchRegion}/api/search?${queryParams}`
      )
        .then((res) => res.json())
        .then((res) => {
          setData(res);
        });
    }
    // else {
    //   setData({ Locations: [] });
    // }
  }, [input, searchRegion]);
  return data;
}
export default useSearchInput;
