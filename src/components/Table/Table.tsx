import { ReactNode } from "react";

type Props = {
  data: any;
  columns: {
    title?: string;
    content: (row: any) => ReactNode | string;
    style?: any;
  }[];
};

const Table: React.FC<Props> = ({ data, columns }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
            <td>{column.title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, index: number) => (
          <tr key={index}>
            {columns.map((column, index) => (
              <td style={column.style} key={index}>
                {column.content(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
