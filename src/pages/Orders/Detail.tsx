import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import { Form } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table/Table";
import { getAllProducts } from "../../axios/products";
import { formatCurrency, getProductFinalPrice } from "../../utilities/helpers";
import { getAllShippingMethods } from "../../axios/shipping_methods";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrder,
} from "../../axios/orders";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import moment from "moment";
import Confirmation from "../../components/Confirmation/Confirmation";

type Order = {
  id?: number;
  name: string;
  address: string;
  zipcode: string;
  locality: string;
  id_shipping_method: number;
  shipping_price?: number;
  state_key?: number;
  state_order?: number;
  date?: string;
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
  discount?: number;
  discount_type?: number;
};

const Detail = () => {
  const navigate = useNavigate();

  const orderId = +useParams().id!;

  const [submiting, setSubmiting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);

  const editable = useMemo(() => true, [order]);

  const total = useMemo(() => {
    return orderProducts.reduce((acc, product) => {
      return acc + getProductFinalPrice(product);
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
            state_key: res.data.state_key,
            state_order: res.data.state_order,
            shipping_price: res.data.shipping_price,
            date: moment(res.data.createdAt).format("YYYY-MM-DD"),
          } as Order);
          setOrderProducts(
            res.data.OrdersProducts.map((product: any) => ({
              id_product: product.id_product,
              price: product.price,
              quantity: product.quantity,
              discount: product.discount,
              discount_type: product.discount_type,
            }))
          );
        })
        .catch(() => {
          toast.error("Encomenda não encontrada");
          navigate("/orders/list");
        });
    } else {
      setOrder({
        date: moment().format("YYYY-MM-DD"),
      } as Order);
    }
  }, [orderId]);

  function updateOrderState(value: any, param: string) {
    setOrder(
      (order) =>
        ({
          ...order,
          [param]: value,
        } as Order)
    );
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

  const shippingPrice = useMemo(() => {
    if (order?.shipping_price) {
      return order?.shipping_price;
    }
    const method = shippingMethods?.find(
      (method: any) => method.value === order?.id_shipping_method
    );
    return method?.price || 0;
  }, [shippingMethods, order?.shipping_price, order?.id_shipping_method]);

  const totalWithShipping = useMemo(() => {
    return total + shippingPrice;
  }, [total, shippingPrice]);

  useEffect(() => {
    getAllProducts({ order: ["name", "ASC"] }).then((res) => {
      setProducts(
        res.data.data.map((product: any) => ({
          ...product,
          value: product.id,
          label: `${product.name} (${product.stock})`,
        }))
      );
    });
    getAllShippingMethods({ order: ["name", "ASC"] }).then((res) => {
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
      date: order?.date,
      products: orderProducts.map((product) => ({
        quantity: product.quantity,
        id_product: product.id_product,
        discount: product.discount,
        discount_type: product.discount_type,
      })),
    };

    createOrder(body)
      .then(() => {
        toast.success("Encomenda criada com sucesso");
        navigate("/orders/list");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Erro ao criar encomenda");
        setSubmiting(false);
      });
  }

  function submitUpdateOrder() {
    const body = {
      name: order?.name,
      address: order?.address,
      zipcode: order?.zipcode,
      locality: order?.locality,
      id_shipping_method: order?.id_shipping_method,
      date: order?.date,
      products: orderProducts.map((product) => ({
        quantity: product.quantity,
        id_product: product.id_product,
        discount: product.discount,
        discount_type: product.discount_type,
      })),
    };

    updateOrder(orderId, body)
      .then(() => {
        toast.success("Encomenda atualizada com sucesso");
        navigate("/orders/list");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Erro ao atualizar encomenda"
        );
        setSubmiting(false);
      });
  }

  function submitDeleteOrder() {
    deleteOrder(orderId)
      .then(() => {
        toast.success("Encomenda eliminada com sucesso");
        navigate("/orders/list");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Erro ao eliminar encomenda"
        );
        setDeleting(false);
      });
  }

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
          disabled={!editable}
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
      style: { width: "200px", textAlign: "center" },
    },
    {
      title: "Quant.",
      content: (row: any, index: number) => (
        <Form.Control
          type="number"
          value={row.quantity || ""}
          onChange={(e) => {
            updateOrderProducts(+e.target.value, "quantity", index);
          }}
          disabled={!editable}
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
      title: "Desconto",
      content: (row: any, index: number) => (
        <Form.Control
          value={row.discount || ""}
          onChange={(e) => {
            updateOrderProducts(e.target.value, "discount", index);
          }}
          disabled={!editable}
        />
      ),
      style: { textAlign: "center", width: "100px" },
    },
    {
      title: "Un.",
      content: (row: any, index: number) => (
        <Form.Select
          value={row.discount ? row.discount_type || "" : ""}
          onChange={(e) => {
            updateOrderProducts(+e.target.value, "discount_type", index);
          }}
          disabled={!editable || !row.discount}
        >
          <option value="" disabled />
          <option value={1}>%</option>
          <option value={2}>€</option>
          <option value={3}>€/u</option>
        </Form.Select>
      ),
      style: { textAlign: "center", width: "90px" },
    },
    {
      title: "Total",
      content: (row: any) => {
        const finalPrice = getProductFinalPrice(row);

        return formatCurrency(finalPrice >= 0 ? finalPrice : 0);
      },
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
          disabled={!editable}
        />
      ),
      style: { width: "60px" },
    },
  ];

  return (
    <>
      <Breadcrumb
        locations={[
          { title: "Encomendas", to: "/orders/list" },
          { title: orderId ? `${orderId}` : "Nova" },
        ]}
      />
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            {orderId ? "Detalhe da encomenda" : "Nova encomenda"}
          </div>
          <div className="card-toolbar">
            <Button
              modifiers="m-2"
              loading={submiting}
              form="orderForm"
              submit
              icon="FloppyDisk"
            />
            <Button
              modifiers="m-2"
              variant="secondary"
              onClick={() => {
                navigate("/orders/list");
              }}
            >
              Voltar
            </Button>
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
                  <Form.Label className="required">Nome</Form.Label>
                  <Form.Control
                    value={order?.name || ""}
                    onChange={(e) => {
                      updateOrderState(e.target.value, "name");
                    }}
                    placeholder="Nome do comprador"
                    required
                    disabled={!editable}
                  />
                </Form.Group>
                <Form.Group controlId="inputName" className="mb-3">
                  <Form.Label className="required">Data</Form.Label>
                  <Form.Control
                    value={order?.date || ""}
                    onChange={(e) => {
                      updateOrderState(e.target.value, "date");
                    }}
                    placeholder="Data da encomenda"
                    required
                    disabled={!editable}
                    type="date"
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
                    disabled={!editable}
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
                      disabled={!editable}
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
                      disabled={!editable}
                    />
                  </Form.Group>
                </div>
                <Form.Group controlId="inputName">
                  <Form.Label className="required">Método de envio</Form.Label>
                  <Form.Select
                    required
                    value={order?.id_shipping_method || ""}
                    onChange={(e) => {
                      updateOrderState(+e.target.value, "id_shipping_method");
                      updateOrderState(null, "shipping_price");
                    }}
                    disabled={!editable}
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
                {editable ? (
                  <p
                    className="text-primary pointer fw-bold my-2"
                    onClick={() => {
                      setOrderProducts((products) => [
                        ...products,
                        {} as OrderProduct,
                      ]);
                    }}
                  >
                    Adicionar produto
                  </p>
                ) : null}
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
                        {shippingPrice ? formatCurrency(shippingPrice!) : "-"}
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
                <div className="d-flex justify-content-between">
                  {order?.state_order && order?.state_order < 4 ? (
                    <Confirmation
                      onConfirm={() => {
                        setDeleting(true);
                        submitDeleteOrder();
                      }}
                      message={
                        "Tem a certeza que pretende eliminar esta encomenda?"
                      }
                      placement="top"
                    >
                      <Button
                        loading={deleting}
                        variant="danger"
                        modifiers="me-3"
                      >
                        Eliminar
                      </Button>
                    </Confirmation>
                  ) : null}
                  <div className="d-flex">
                    <Button loading={submiting} modifiers="me-3" submit>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Detail;
