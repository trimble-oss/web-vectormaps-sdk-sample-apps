class TokenService {
  getToken() {
    var apiKey = document.getElementById("keyInput").value;
    let promise = new Promise(async function (resolve, reject) {
      let requestBody = {
        apiKey: apiKey,
      };

      //Generate bearer token for Places API.
      const tokenHttp = new XMLHttpRequest();
      tokenHttp.open("POST", constants.AUTH_WS_URL, false);
      tokenHttp.setRequestHeader("Content-Type", "application/json");
      document.getElementById("apiKeyError").style.display = "none";
      try {
        tokenHttp.send(JSON.stringify(requestBody));
        if (tokenHttp.status == 200) {
          const token = JSON.parse(tokenHttp.responseText);
          const decoded = jwtDecode(token.token);
          processLicense(decoded.features);
          localStorage.setItem("licensedFeatures", decoded.features);
          resolve(decoded.features);
        } else {
          reject("There is an Error!");
        }
      } catch (error) {
        reject("There is an Error!");
      }
    });
    return promise;
  }
}
