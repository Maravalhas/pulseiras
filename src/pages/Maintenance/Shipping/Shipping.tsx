import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import { Form } from "react-bootstrap";
import Pagination from "../../../components/Table/Pagination";
import {
  createShippingMethod,
  getAllShippingMethods,
  updateShippingMethod,
} from "../../../axios/shipping_methods";
import Button from "../../../components/Button/Button";
import { toast } from "react-toastify";
import moment from "moment";

type ShippingMethod = {
  id: number;
  name: string;
  price: number;
};

const Shipping = () => {
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<string[]>(["name", "ASC"]);

  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  function getData() {
    setLoading(true);
    getAllShippingMethods({
      offset: offset[0] * (offset[1] - 1),
      limit: offset[0],
      order: order,
      search: search,
    }).then((response) => {
      setData(response.data);
    });
  }

  useEffect(() => {
    const timeout = setTimeout(getData, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [offset, order, search]);

  useEffect(() => {
    if (data.data) {
      setLoading(false);
    }
  }, [data]);

  const columns = [
    {
      title: "Nome",
      content: (row: any) => row.name,
      sort: "name",
    },
    {
      title: "Preço",
      content: (row: any) => row.price + "€",
      style: { width: "100px" },
      sort: "price",
    },
    {
      title: "Data Adição",
      content: (row: any) =>
        moment(row.createdAt).format("DD/MM/YYYY [às] HH:mm[h]"),
      sort: "createdAt",
      style: { width: "200px" },
    },
  ];

  function updateShippingState(value: any, key: string) {
    setSelectedShipping((shipping: any) => {
      return { ...shipping, [key]: value };
    });
  }

  function submitCreateShipping() {
    const body = {
      name: selectedShipping.name,
      price: selectedShipping.price,
    };

    createShippingMethod(body)
      .then(() => {
        toast.success("Método de envio criado com sucesso");
        setSelectedShipping(null);
        setSubmiting(false);
        getData();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Erro ao criar método de envio"
        );
        setSubmiting(false);
      });
  }

  function submitUpdateShipping() {
    const body = {
      name: selectedShipping.name,
      price: selectedShipping.price,
    };

    updateShippingMethod(selectedShipping.id, body)
      .then(() => {
        toast.success("Método de envio atualizado com sucesso");
        setSelectedShipping(null);
        setSubmiting(false);
        getData();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Erro ao atualizar método de envio"
        );
        setSubmiting(false);
      });
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="col-12 col-lg-6 pe-lg-3 mb-3 mb-lg-0">
        <div className="card card-shadow">
          <div className="card-header">
            <div className="card-title">Lista de métodos de envio</div>
            <div className="card-toolbar text-muted">
              {data.total} método{data?.total !== 1 && "s"}
            </div>
          </div>
          <div className="card-body p-0 mt-1">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
              <div className="d-flex">
                <Form.Control
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            <Table
              data={data.data}
              columns={columns}
              loading={loading}
              sort={order}
              setSort={setOrder}
              selectableRows
              selectedRow={selectedShipping?.id}
              onRowSelected={(row: any) => {
                if (row.id !== selectedShipping?.id) {
                  setSelectedShipping(row);
                } else {
                  setSelectedShipping(null);
                }
              }}
              modifiers="mb-3"
            />
            <div className="d-flex justify-content-center mb-2">
              <Pagination
                pagination={offset}
                setPagination={setOffset}
                totalPages={data.total ? Math.ceil(data.total / offset[0]) : 0}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="card card-shadow">
          <div className="card-header">
            <div className="card-title">Detalhe do método de envio</div>
            <div className="card-toolbar">
              <Button
                onClick={() => {
                  setSelectedShipping({
                    name: "",
                    price: 0,
                  } as ShippingMethod);
                }}
                disabled={
                  selectedShipping && !selectedShipping.id ? true : false
                }
              >
                Criar
              </Button>
            </div>
          </div>
          {selectedShipping ? (
            <form
              id="productForm"
              className="card-body py-2 px-0"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmiting(true);
                if (selectedShipping?.id) {
                  submitUpdateShipping();
                } else {
                  submitCreateShipping();
                }
              }}
            >
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label className="required">Nome</Form.Label>
                <Form.Control
                  value={selectedShipping?.name || ""}
                  onChange={(e) => {
                    updateShippingState(e.target.value, "name");
                  }}
                  placeholder="Nome do método de envio"
                  required
                  disabled={!selectedShipping}
                />
              </Form.Group>
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Preço (€)</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedShipping?.price || ""}
                  onChange={(e) => {
                    updateShippingState(+e.target.value, "price");
                  }}
                  placeholder="Preço do método de envio"
                  disabled={!selectedShipping}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  loading={submiting}
                  modifiers="me-3"
                  submit
                  disabled={!selectedShipping}
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    setSelectedShipping(null);
                  }}
                  disabled={!selectedShipping}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-align-center my-5">
              <p className="fs-4 mb-0">Nenhum método de envio selecionado</p>
              <p className="mb-0">
                Selecione um método de envio da lista para o editar ou pressione
                criar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shipping;
