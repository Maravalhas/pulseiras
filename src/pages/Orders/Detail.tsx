import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import { Form } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table/Table";
import { getAllProducts } from "../../axios/products";
import { formatCurrency } from "../../utilities/helpers";
import { getAllShippingMethods } from "../../axios/shipping_methods";
import { createOrder, getOrderById } from "../../axios/orders";
import { toast } from "react-toastify";

type Order = {
  id?: number;
  name: string;
  address: string;
  zipcode: string;
  locality: string;
  id_shipping_method: number;
};

type Product = {
  id?: number;
  name: string;
  description: string;
  id_category: number;
  category: string;
  stock: number;
  price: number;
};

type ShippingMethods = {
  id?: number;
  name: string;
  price: number;
};

type OrderProduct = {
  id?: number;
  id_product: number;
  price: number;
  quantity: number;
};

const Detail = () => {
  const navigate = useNavigate();

  const orderId = +useParams().id!;

  const [submiting, setSubmiting] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);

  const total = useMemo(() => {
    return orderProducts.reduce((acc, product) => {
      return acc + (product.price || 0) * (product.quantity || 0);
    }, 0);
  }, [orderProducts]);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then((res: any) => {
          setOrder({
            name: res.data.name,
            address: res.data.address,
            zipcode: res.data.zipcode,
            locality: res.data.locality,
            id_shipping_method: res.data.id_shipping_method,
          } as Order);
          setOrderProducts(
            res.data.OrdersProducts.map((product: any) => ({
              id_product: product.id_product,
              price: product.price,
              quantity: product.quantity,
            }))
          );
        })
        .catch(() => {
          toast.error("Encomenda não encontrada");
          navigate("/orders/list");
        });
    } else {
      setOrder({} as Order);
    }
  }, [orderId]);

  function updateOrderState(value: any, param: string) {
    setOrder({
      ...order,
      [param]: value,
    } as Order);
  }

  function updateOrderProducts(value: any, param: string, index: number) {
    setOrderProducts((products) => {
      let copy = [...products];
      copy[index] = {
        ...copy[index],
        [param]: value,
      };
      return copy;
    });
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethods[]>([]);

  const selectedMethod = useMemo(() => {
    return shippingMethods?.find(
      (method: any) => method.value === order?.id_shipping_method
    );
  }, [shippingMethods, order?.id_shipping_method]);

  const totalWithShipping = useMemo(() => {
    if (!selectedMethod) return total;
    return total + (selectedMethod?.price || 0);
  }, [total, selectedMethod]);

  useEffect(() => {
    getAllProducts({}).then((res) => {
      setProducts(
        res.data.data.map((product: any) => ({
          ...product,
          value: product.id,
          label: product.name,
        }))
      );
    });
    getAllShippingMethods({}).then((res) => {
      setShippingMethods(
        res.data.data.map((shipping: any) => ({
          ...shipping,
          value: shipping.id,
          label: shipping.name,
        }))
      );
    });
  }, []);

  function submitCreateOrder() {
    const body = {
      name: order?.name,
      address: order?.address,
      zipcode: order?.zipcode,
      locality: order?.locality,
      id_shipping_method: order?.id_shipping_method,
      products: orderProducts.map((product) => ({
        quantity: product.quantity,
        id_product: product.id_product,
      })),
    };

    createOrder(body)
      .then((res) => {
        toast.success("Encomenda criada com sucesso");
        navigate("/orders/list");
      })
      .catch((err) => {
        toast.error("Erro ao criar encomenda");
        setSubmiting(false);
      });
  }

  function submitUpdateOrder() {}

  const columns = [
    {
      title: "Produto",
      content: (row: any, index: number) => (
        <Form.Select
          value={row.id_product || ""}
          onChange={(e) => {
            setOrderProducts((orderProducts) => {
              let copy = [...orderProducts];
              const selectedProduct = products.find(
                (product) => product.id === +e.target.value
              );
              copy[index] = {
                id_product: +e.target.value,
                price: selectedProduct?.price || 0,
                quantity: 0,
              };
              return copy;
            });
          }}
        >
          <option value={""} disabled>
            Selecione um produto
          </option>
          {products.map((product: any) => (
            <option key={product.value} value={product.value}>
              {product.label}
            </option>
          ))}
        </Form.Select>
      ),
    },
    {
      title: "Quantidade",
      content: (row: any, index: number) => (
        <Form.Control
          type="number"
          value={row.quantity || ""}
          onChange={(e) => {
            updateOrderProducts(+e.target.value, "quantity", index);
          }}
        />
      ),
      style: { width: "100px", textAlign: "center" },
    },
    {
      title: "Preço",
      content: (row: any) => (row.price ? formatCurrency(row.price) : "-"),
      style: { textAlign: "center", width: "100px" },
    },
    {
      title: "Total",
      content: (row: any) =>
        row.price && row.quantity
          ? formatCurrency(row.price * row.quantity)
          : "-",
      style: { textAlign: "center", width: "100px" },
    },
    {
      content: (_: any, index: number) => (
        <Button
          icon="X"
          variant="danger"
          onClick={() => {
            setOrderProducts((products) => {
              let copy = [...products];
              copy.splice(index, 1);
              return copy;
            });
          }}
        />
      ),
      style: { width: "50px" },
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          {orderId ? "Detalhe da encomenda" : "Nova encomenda"}
        </div>
        <div className="card-toolbar">
          <Button modifiers="me-3" loading={submiting} form="orderForm" submit>
            Guardar
          </Button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("/orders/list");
            }}
          >
            Voltar
          </button>
        </div>
      </div>
      <div className="card-body">
        <form
          id="orderForm"
          className="card-body px-0"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmiting(true);
            if (orderId) {
              submitUpdateOrder();
            } else {
              submitCreateOrder();
            }
          }}
        >
          <div className="info-card">
            <div className="info-card-title">
              <p>Dados Gerais</p>
            </div>
            <div className="info-card-body">
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  value={order?.name || ""}
                  onChange={(e) => {
                    updateOrderState(e.target.value, "name");
                  }}
                  placeholder="Nome do comprador"
                  required
                  disabled={!order}
                />
              </Form.Group>
              <Form.Group controlId="inputAddress" className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  value={order?.address || ""}
                  onChange={(e) => {
                    updateOrderState(e.target.value, "address");
                  }}
                  placeholder="Endereço de entrega"
                  as="textarea"
                  disabled={!order}
                />
              </Form.Group>
              <div className="d-flex">
                <Form.Group
                  controlId="inputZipCode"
                  className="mb-3 col-5 pe-3"
                >
                  <Form.Label>Código postal</Form.Label>
                  <Form.Control
                    value={order?.zipcode || ""}
                    onChange={(e) => {
                      updateOrderState(e.target.value, "zipcode");
                    }}
                    placeholder="Código postal"
                    disabled={!order}
                  />
                </Form.Group>
                <Form.Group controlId="inputLocality" className="mb-3 col-7">
                  <Form.Label>Localidade</Form.Label>
                  <Form.Control
                    value={order?.locality || ""}
                    onChange={(e) => {
                      updateOrderState(e.target.value, "locality");
                    }}
                    placeholder="Localidade"
                    disabled={!order}
                  />
                </Form.Group>
              </div>
              <Form.Group controlId="inputName">
                <Form.Label>Método de envio</Form.Label>
                <Form.Select
                  required
                  value={order?.id_shipping_method || ""}
                  onChange={(e) => {
                    updateOrderState(+e.target.value, "id_shipping_method");
                  }}
                  disabled={!order}
                >
                  <option value="" disabled>
                    Selecione um método de envio
                  </option>
                  {shippingMethods.map((shipping: any) => (
                    <option key={shipping.value} value={shipping.value}>
                      {shipping.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-title">
              <p>Produtos</p>
            </div>
            <div className="info-card-body">
              <Table data={orderProducts} columns={columns} />
              <p
                className="text-primary pointer fw-bold"
                onClick={() => {
                  setOrderProducts((products) => [
                    ...products,
                    {} as OrderProduct,
                  ]);
                }}
              >
                Adicionar produto
              </p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-title">
              <p>Resumo</p>
            </div>
            <div className="info-card-body">
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "100%" }}></td>
                    <td className="text-align-right pe-5 fw-semibold">
                      Produtos:
                    </td>
                    <td>{total ? formatCurrency(total) : "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ width: "100%" }}></td>
                    <td className="text-align-right pe-5 fw-semibold">
                      Portes:
                    </td>
                    <td>
                      {selectedMethod?.price
                        ? formatCurrency(selectedMethod?.price!)
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "100%" }}></td>
                    <td className="text-align-right pe-5 fw-semibold">
                      Total:
                    </td>
                    <td className="fw-semibold">
                      {totalWithShipping
                        ? formatCurrency(totalWithShipping)
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-title"></div>
            <div className="info-card-body">
              <div className="d-flex justify-content-end">
                <Button loading={submiting} modifiers="me-3" submit>
                  Guardar
                </Button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    navigate("/products/list");
                  }}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Detail;
