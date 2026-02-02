import { Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import { useProfile } from '../hooks/useProfile';

export default function ProfilePage() {
  const { logout } = useAuth();
  const { user, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          <ProfileCard user={user} onLogout={logout} />
        </Col>
      </Row>
    </Container>
  );
}
