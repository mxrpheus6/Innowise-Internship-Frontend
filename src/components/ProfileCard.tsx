import { Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { UserResponse } from '../types/users';
import { ROUTES } from '../routes';

type ProfileCardProps = {
  user: UserResponse | null;
  onLogout: () => void;
};

function formatBirthDate(value: string | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('ru-RU');
}

export default function ProfileCard({ user, onLogout }: ProfileCardProps) {
  const navigate = useNavigate();
  const initials = user
    ? `${user.name?.charAt(0) ?? ''}${user.surname?.charAt(0) ?? ''}`
    : '';

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-primary text-white py-3 border-0">
        <h4 className="mb-0 text-center">Профиль пользователя</h4>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div
            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
            style={{ width: '80px', height: '80px', fontSize: '2rem', color: '#0d6efd' }}
          >
            {initials}
          </div>
          <h5 className="fw-bold">
            {user?.name} {user?.surname}
          </h5>
          <span className="text-muted small">{user?.email}</span>
        </div>

        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">ID:</span>
            <span className="font-monospace small">{user?.id}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Дата рождения:</span>
            <span>{formatBirthDate(user?.birthDate)}</span>
          </ListGroup.Item>
        </ListGroup>

        <div className="d-grid gap-2">
          {/* НОВАЯ КНОПКА МАГАЗИНА */}
          <Button 
            variant="success" 
            className="fw-bold mb-2"
            onClick={() => navigate(ROUTES.MARKETPLACE)}
          >
            Маркетплейс
          </Button>

          <Button variant="primary" onClick={() => navigate(ROUTES.ORDERS)}>
            Заказы
          </Button>
          <Button variant="primary" onClick={() => navigate(ROUTES.PAYMENTS)}>
            Платежи
          </Button>
          <Button variant="link" className="text-danger mt-2" onClick={onLogout}>
            Выйти из системы
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}