import { Container, Card, Form, Button, Row, Col, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { useAuthForm } from '../hooks/useAuthForm';

const today = new Date().toISOString().split('T')[0];

export default function AuthPage() {
  const {
    isLogin,
    validated,
    showPassword,
    loading,
    error,
    formData,
    handleChange,
    handleSubmit,
    toggleAuthMode,
    toggleShowPassword,
  } = useAuthForm();

  return (
    <Container fluid className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="shadow border-0 p-3">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold text-primary">
                {isLogin ? 'Вход' : 'Регистрация'}
              </h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Имя</Form.Label>
                          <Form.Control
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Фамилия</Form.Label>
                          <Form.Control
                            name="surname"
                            type="text"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Дата рождения</Form.Label>
                      <Form.Control
                        name="birthDate"
                        type="date"
                        max={today}
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="8-32 символа"
                      value={formData.password}
                      minLength={8}
                      maxLength={32}
                      onChange={handleChange}
                      required
                    />
                    <Button variant="outline-secondary" onClick={toggleShowPassword}>
                      {showPassword ? '🔒' : '👁️'}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Пароль должен быть от 8 до 32 символов.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mt-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    isLogin ? 'Войти' : 'Зарегистрироваться'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={toggleAuthMode}
                  className="text-decoration-none text-secondary"
                >
                  {isLogin ? 'Создать новый аккаунт' : 'Уже зарегистрированы? Войти'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
