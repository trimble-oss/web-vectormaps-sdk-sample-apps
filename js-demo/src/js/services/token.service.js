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
      tokenHttp.send(JSON.stringify(requestBody));

      if (tokenHttp.status == 200) {
        const token = JSON.parse(tokenHttp.responseText);
        console.log(token);
        const decoded = jwtDecode(token.token);
        processLicense(decoded.features);
        resolve(decoded.features);
      } else {
        reject("There is an Error!");
      }
    });
    return promise;
  }
}
