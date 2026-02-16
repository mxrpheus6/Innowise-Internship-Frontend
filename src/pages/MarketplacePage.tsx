import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { itemsApi } from "../api/items";
import { ordersApi } from "../api/orders";
import { ROUTES } from "../routes";
import type { ItemResponse } from "../types/items";

interface CartItem {
  item: ItemResponse;
  quantity: number;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function MarketplacePage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemsApi.getAll();
      setItems(data);
    } catch (e) {
      console.error(e);
      setError("Unable to load the list of products.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: ItemResponse) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const changeQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((i) => {
        if (i.item.id === itemId) {
          const newQuantity = i.quantity + delta;
          return newQuantity > 0 ? { ...i, quantity: newQuantity } : i;
        }
        return i;
      });
    });
  };

  const clearCart = () => setCart([]);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCreatingOrder(true);
    setError(null);

    try {
      const orderPayload = {
        orderItems: cart.map((c) => ({
          itemId: c.item.id,
          quantity: c.quantity,
        })),
      };

      await ordersApi.createOrder(orderPayload);
      clearCart();
      navigate(ROUTES.ORDERS);
    } catch (err) {
      console.error(err);
      setError("Error creating order. Please try again.");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Shop</h2>
        <Button
          variant="outline-primary"
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          ← Profile
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={8} md={7}>
          <Row xs={1} md={2} xl={3} className="g-4">
            {items.map((item) => (
              <Col key={item.id}>
                <Card className="h-100 shadow-sm border-0">
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "150px", fontSize: "3rem" }}
                  >
                    📦
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className="fw-bold text-primary fs-5">
                      {formatPrice(item.price)}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      className="mt-auto w-100"
                      onClick={() => addToCart(item)}
                    >
                      Add To Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col lg={4} md={5}>
          <div style={{ position: "sticky", top: "20px" }}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Your cart:</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {cart.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    Cart Is Empty
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {cart.map((c) => (
                      <ListGroup.Item key={c.item.id}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span
                            className="fw-bold text-truncate"
                            style={{ maxWidth: "140px" }}
                          >
                            {c.item.name}
                          </span>
                          <span className="text-muted small">
                            {formatPrice(c.item.price * c.quantity)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="px-2 py-0"
                              onClick={() => changeQuantity(c.item.id, -1)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{c.quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="px-2 py-0"
                              onClick={() => changeQuantity(c.item.id, 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="link"
                            className="text-danger p-0 text-decoration-none small"
                            onClick={() => removeFromCart(c.item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>

              {cart.length > 0 && (
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-5">Total:</span>
                    <span className="fs-4 fw-bold text-primary">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="d-grid">
                    <Button
                      variant="success"
                      size="lg"
                      disabled={creatingOrder}
                      onClick={handleCheckout}
                    >
                      {creatingOrder ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        "Place an Order"
                      )}
                    </Button>
                  </div>
                </Card.Footer>
              )}
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
