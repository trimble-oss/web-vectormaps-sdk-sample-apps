//On document ready, fire off the auth modal for accepting the API key.
$(function () {
  $("#authModal").modal("show");
  const mapService = new MapService();
  const tokenService = new TokenService();
  addEventListenerToDiv(mapService, tokenService);
});
