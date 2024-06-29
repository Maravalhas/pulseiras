import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Table/Pagination";
import { getAllProducts } from "../../axios/products";
import { Form } from "react-bootstrap";

const List = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(["id", "ASC"]);

  function getData() {
    getAllProducts({
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
  }, []);

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
      content: (row: any) => row.price,
      sort: "price",
    },
    {
      title: "Categoria",
      content: (row: any) => row.category,
    },
    {
      title: "Stock",
      content: (row: any) => row.stock,
      sort: "stock",
    },
    {
      title: "Data Adição",
      content: (row: any) => row.created_at,
      sort: "created_at",
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Produtos</div>
        <div className="card-toolbar">
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/products/list/new");
            }}
          >
            Novo produto
          </button>
        </div>
      </div>
      <div className="card-body px-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Form.Control
              placeholder="Pesquisar produto"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <p className="mb-0 text-muted">{data.total} produtos</p>
        </div>
        <Table
          data={data.data}
          columns={columns}
          loading={loading}
          sort={order}
          setSort={setOrder}
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
