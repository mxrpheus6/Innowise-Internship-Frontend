import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8081",
  realm: "OAuth",
  clientId: "payment-front-client",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
