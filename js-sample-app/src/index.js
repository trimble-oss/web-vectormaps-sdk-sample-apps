//On document ready, fire off the auth modal for accepting the API key.
document.addEventListener("DOMContentLoaded", () => {
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("authModal")
  ).show();
  const mapService = new MapService();
  const tokenService = new TokenService();
  addEventListenerToDiv(mapService, tokenService);
});
