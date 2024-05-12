import { useMemo, useState } from "react";
import Table from "../../components/Table/Table";

const List = () => {
  const [orders, setOrders] = useState([
    {
      name: "João",
    },
    {
      name: "António",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        title: "Nº",
        content: (row: any) => row.id,
        style: { width: "60px" },
      },
      {
        title: "Nome",
        content: (row: any) => row.name,
        style: { width: "250px" },
      },
      {
        title: "Data",
        content: (row: any) => row.date,
        style: { width: "200px" },
      },
      {
        title: "Produtos",
        content: (row: any) => "",
      },
    ],
    []
  );

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <div></div>
        <button className="btn btn-primary">Nova Encomenda</button>
      </div>
      <Table data={orders} columns={columns} />
    </div>
  );
};

export default List;
