import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table/Table";
import { getAllOrders, patchOrderState } from "../../axios/orders";
import Pagination from "../../components/Table/Pagination";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/Button/Button";
import LabelState from "../../components/State/State";
import { toast } from "react-toastify";
import { getAllOrdersStates } from "../../axios/orders_states";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Confirmation from "../../components/Confirmation/Confirmation";

const List = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(["createdAt", "DESC"]);

  const [selectedState, setSelectedState] = useState(0);
  const [states, setStates] = useState<any>([]);

  function getData() {
    setLoading(true);
    getAllOrders({
      offset: offset[0] * (offset[1] - 1),
      limit: offset[0],
      search,
      order,
      state: selectedState || undefined,
      products: 1,
    }).then((res) => {
      setData(res.data);
    });
  }

  useEffect(() => {
    getAllOrdersStates().then((res) => {
      setStates(res.data);
    });
  }, []);

  useEffect(() => {
    let timeout = setTimeout(getData, search ? 300 : 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [offset, search, order, selectedState]);

  useEffect(() => {
    if (data.data) {
      setLoading(false);
    }
  }, [data]);

  const columns = useMemo(
    () => [
      {
        title: "Nº",
        content: (row: any) => row.id,
        style: { width: "100px" },
        sort: "id",
      },
      {
        title: "Nome",
        content: (row: any) => row.name,
        sort: "name",
        style: { width: "150px" },
      },
      {
        title: "Produtos",
        content: (row: any) => {
          const products = row.OrdersProducts;

          return products.map((product: any) => (
            <p className="mb-0">
              {product.name} x{product.quantity}
            </p>
          ));
        },
        style: { width: "150px" },
      },
      {
        title: "Data da encomenda",
        content: (row: any) => moment(row.createdAt).format("DD/MM/YYYY"),
        style: { width: "210px", textAlign: "center" },
        sort: "createdAt",
      },
      {
        title: "Data da expedição",
        content: (row: any) =>
          row.date_shipped
            ? moment(row.date_shipped).format("DD/MM/YYYY")
            : "-",
        style: { width: "210px", textAlign: "center" },
        sort: "date_shipped",
      },
      {
        title: "Estado",
        content: (row: any) => {
          let color: any = "";

          switch (row.state_key) {
            case "P":
              color = "warning";
              break;
            case "C":
              color = "info";
              break;
            case "A":
              color = "success-light";
              break;
            case "E":
              color = "warning-light";
              break;
            case "R":
              color = "success";
              break;
          }

          return <LabelState variant={color} content={row.state} />;
        },
        style: { width: "120px", textAlign: "center" },
        sort: "id_state",
      },
      {
        content: (row: any) => {
          let config: any;

          switch (row.state_key) {
            case "P":
              config = {
                icon: "Coins",
                header: "Confirmar pagamento?",
              };
              break;
            case "C":
              config = {
                icon: "Truck",
                header: "Deseja confirmar a expedição desta encomenda?",
              };
              break;
            case "E":
              config = {
                icon: "Check",
                header: "Deseja confirmar a entrega desta encomenda?",
              };
              break;
          }

          if (config)
            return (
              <Confirmation
                message={config.header}
                onConfirm={() => {
                  patchOrderState(row.id)
                    .then(() => {
                      getData();
                    })
                    .catch((err) => {
                      toast.error(
                        err.response?.data?.message ||
                          "Não foi possivel alterar o estado da encomenda"
                      );
                    });
                }}
              >
                <Button icon={config.icon} />
              </Confirmation>
            );
        },
        style: { width: "60px", textAlign: "center" },
        button: true,
      },
    ],
    []
  );

  return (
    <>
      <Breadcrumb locations={[{ title: "Encomendas" }]} />
      <div className="card">
        <div className="card-header">
          <div className="card-title">Encomendas</div>
          <div className="card-toolbar">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/orders/list/new");
              }}
            >
              Nova Encomenda
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <div className="d-flex my-2">
              <Form.Control
                placeholder="Pesquisar"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="flex-grow me-3"
              />
              <Form.Select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(parseInt(e.target.value));
                }}
              >
                <option value={0}>Todos os estados</option>
                {states.map((state: any) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </div>
            <p className="my-2 text-muted">{data.total} encomendas</p>
          </div>
          <Table
            data={data.data}
            columns={columns}
            loading={loading}
            sort={order}
            setSort={setOrder}
            selectableRows
            onRowSelected={(row) => {
              navigate(`/orders/list/${row.id}`);
            }}
            modifiers="mb-3"
          />
          <Pagination
            totalPages={data.total ? Math.ceil(data.total / offset[0]) : 0}
            pagination={offset}
            setPagination={setOffset}
          />
        </div>
      </div>
    </>
  );
};

export default List;
