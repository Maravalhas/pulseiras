import { ReactNode } from "react";

type Props = {
  data: any;
  columns: {
    title?: string;
    content: (row: any) => ReactNode | string;
    style?: any;
  }[];
  loading?: boolean;
};

const Table: React.FC<Props> = ({ data, columns, loading }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <td key={index}>{column.title}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data?.map((row: any, index: number) => (
              <tr key={index}>
                {columns.map((column, index) => (
                  <td style={column.style} key={index}>
                    {column.content(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length} className="text-align-center p-4">
                Sem dados para apresentar
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading ? <div className="loading">Loading...</div> : null}
    </div>
  );
};

export default Table;
