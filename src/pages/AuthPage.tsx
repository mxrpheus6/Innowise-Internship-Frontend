import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthPage() {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow border-0 text-center p-4">
            <Card.Body>
              <div className="mb-4">
                <h2 className="fw-bold text-primary">Welcome</h2>
                <p className="text-muted">
                  To access the system, you must log in via SSO service.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 mb-3 fw-bold"
                onClick={login}
              >
                Log in via Keycloak
              </Button>

              <div className="mt-3">
                <small className="text-muted">
                  You will be redirected to a secure authorization page.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
