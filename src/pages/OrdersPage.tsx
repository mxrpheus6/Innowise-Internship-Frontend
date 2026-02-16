import { useState } from "react";
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
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useOrders } from "../hooks/useOrders";
import { ROUTES } from "../routes";
import type {
  OrderStatus,
  OrderResponse,
  OrderItemResponse,
} from "../types/orders";

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

function calculateTotal(items: OrderItemResponse[]) {
  const total = items.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0,
  );
  return formatCurrency(total);
}

function getStatusBadge(status: OrderStatus): string {
  switch (status) {
    case "PAID":
      return "success";
    case "NEW":
      return "primary";
    case "CANCELLED":
      return "danger";
    default:
      return "secondary";
  }
}

function translateStatus(status: OrderStatus): string {
  switch (status) {
    case "NEW":
      return "Pending";
    case "PAID":
      return "Paid";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const { loading: userLoading, error: userError } = useProfile();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null,
  );

  const loading = userLoading || ordersLoading;
  const error = userError ?? ordersError;

  const handleCloseModal = () => setSelectedOrder(null);
  const handleShowDetails = (order: OrderResponse) => setSelectedOrder(order);

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
            <h2 className="mb-0">My orders</h2>
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
              {orders.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Orders history is empty.
                </div>
              ) : (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th className="text-center">Positions</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const itemsCount = order.items.length;

                      return (
                        <tr key={order.id}>
                          <td className="font-monospace small user-select-all">
                            {order.id}
                          </td>
                          <td>{formatTimestamp(order.creationDate)}</td>
                          <td className="text-center">
                            <Button
                              variant="link"
                              className="text-decoration-none"
                              onClick={() => handleShowDetails(order)}
                            >
                              {itemsCount} {itemsCount === 1 ? "item" : "items"}
                            </Button>
                          </td>
                          <td className="fw-bold text-nowrap">
                            {calculateTotal(order.items)}
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(order.status)}>
                              {translateStatus(order.status)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно с деталями заказа */}
      <Modal
        show={!!selectedOrder}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="mb-3">
                <strong>ID:</strong>{" "}
                <span className="font-monospace text-muted">
                  {selectedOrder.id}
                </span>
              </div>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="text-center" style={{ width: "100px" }}>
                      Amount
                    </th>
                    <th className="text-end" style={{ width: "120px" }}>
                      Price per unit
                    </th>
                    <th className="text-end" style={{ width: "120px" }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((lineItem, idx) => (
                    <tr key={idx}>
                      <td>{lineItem.item.name}</td>
                      <td className="text-center">{lineItem.quantity}</td>
                      <td className="text-end">
                        {formatCurrency(lineItem.item.price)}
                      </td>
                      <td className="text-end">
                        {formatCurrency(
                          lineItem.item.price * lineItem.quantity,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">
                      Total:
                    </td>
                    <td className="text-end fw-bold">
                      {calculateTotal(selectedOrder.items)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
