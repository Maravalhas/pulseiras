import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table/Table";
import { getAllOrders } from "../../axios/orders";
import Pagination from "../../components/Table/Pagination";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const List = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(["id", "ASC"]);

  function getData() {
    setLoading(true);
    getAllOrders({
      offset: offset[0] * (offset[1] - 1),
      limit: offset[0],
      search,
      order,
    }).then((res) => {
      setData(res.data);
    });
  }

  useEffect(() => {
    let timeout = setTimeout(getData, search ? 300 : 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [offset, search, order]);

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
      },
      {
        title: "Endereço",
        content: (row: any) => (
          <>
            <p className="mb-0">{row.address}</p>
            <p className="mb-0">{row.zipcode + ", " + row.locality}</p>
          </>
        ),
        sort: "name",
      },
      {
        title: "Data",
        content: (row: any) =>
          moment(row.created_at).format("DD/MM/YYYY [às] HH:mm[h]"),
        style: { width: "200px" },
        sort: "created_at",
      },
    ],
    []
  );

  return (
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
      <div className="card-body px-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Form.Control
              placeholder="Pesquisar encomendas"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <p className="mb-0 text-muted">{data.total} encomendas</p>
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
        />
        <div className="d-flex justify-content-center">
          <Pagination
            totalPages={data.total ? Math.ceil(data.total / offset[0]) : 0}
            pagination={offset}
            setPagination={setOffset}
          />
        </div>
      </div>
    </div>
  );
};

export default List;
