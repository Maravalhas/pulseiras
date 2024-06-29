import { useState } from "react";
import Table from "../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Table/Pagination";

const List = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(["id", "ASC"]);

  const columns = [
    {
      title: "Nome",
      content: (row: any) => row.name,
    },
    {
      title: "Preço",
      content: (row: any) => row.price,
    },
    {
      title: "Categoria",
      content: (row: any) => row.category,
    },
    {
      title: "Stock",
      content: (row: any) => row.stock,
    },
  ];

  return (
    <>
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
          <Table data={data.data} columns={columns} loading />
          <div className="d-flex justify-content-center">
            <Pagination
              totalPages={data.total ? Math.ceil(data.total / offset[0]) : 0}
              pagination={offset}
              setPagination={setOffset}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
