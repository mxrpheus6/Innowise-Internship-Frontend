import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Table,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { usePayments } from "../hooks/usePayments";
import { ROUTES } from "../routes";

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getStatusBadge(status: string): string {
  switch (status) {
    case "SUCCESS":
    case "PAID":
    case "COMPLETED":
      return "success";
    case "PENDING":
    case "PROCESSING":
      return "warning";
    case "FAILED":
    case "DECLINED":
    case "CANCELLED":
      return "danger";
    default:
      return "secondary";
  }
}

function translatePaymentStatus(status: string): string {
  switch (status) {
    case "SUCCESS":
      return "Success";
    case "FAILED":
      return "Failed";
    default:
      return status;
  }
}

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { user, loading: userLoading, error: userError } = useProfile();
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
  } = usePayments(user?.id ?? null);

  const loading = userLoading || paymentsLoading;
  const error = userError ?? paymentsError;

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">My payments</h2>
            <Button
              variant="outline-primary"
              onClick={() => navigate(ROUTES.PROFILE)}
            >
              ← Profile
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {payments.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Payments not found.
                </div>
              ) : (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Payment ID</th>
                      <th>Order ID</th>
                      <th className="text-center">Status</th>
                      <th>Total</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="font-monospace small user-select-all">
                          {p.id}
                        </td>
                        <td className="font-monospace small text-muted">
                          {p.orderId}
                        </td>
                        <td className="text-center">
                          <Badge
                            bg={getStatusBadge(p.status)}
                            className="p-2"
                            style={{
                              minWidth: "120px",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                            }}
                          >
                            {translatePaymentStatus(p.status)}
                          </Badge>
                        </td>
                        <td className="fw-bold text-nowrap">
                          {formatCurrency(p.paymentAmount)}
                        </td>
                        <td>{formatTimestamp(p.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
