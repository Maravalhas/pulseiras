import { ReactNode, useMemo } from "react";
import { clsx } from "../../utilities/helpers";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

type Props = {
  data: any;
  columns: {
    title?: string;
    content: (row: any, index: number) => ReactNode | string;
    style?: any;
    sort?: string;
  }[];
  loading?: boolean;
  sort?: string[];
  setSort?: (value: string[]) => void;
  selectableRows?: boolean;
  onRowSelected?: (row: any) => void;
  selectedRow?: number;
};

const Table: React.FC<Props> = ({
  data,
  columns,
  loading,
  sort,
  setSort,
  selectableRows,
  onRowSelected,
  selectedRow,
}) => {
  const useSort = useMemo(() => {
    return sort && setSort;
  }, [sort, setSort]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => {
              const sorting =
                useSort && column.sort && sort![0] === column.sort;
              return (
                <td
                  className={clsx(useSort && column.sort ? "pointer" : "")}
                  style={column.style}
                  key={index}
                  onClick={() => {
                    if (useSort && column.sort) {
                      if (sort![0] === column.sort) {
                        setSort!([
                          column.sort,
                          sort![1] === "ASC" ? "DESC" : "ASC",
                        ]);
                      } else {
                        setSort!([column.sort, "asc"]);
                      }
                    }
                  }}
                >
                  {column.title}{" "}
                  {sorting ? (
                    <>{sort![1] === "ASC" ? <CaretUp /> : <CaretDown />}</>
                  ) : null}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data?.map((row: any, index: number) => (
              <tr
                key={index}
                className={clsx(
                  selectableRows && "pointer",
                  selectableRows && selectedRow === row.id ? "selected" : ""
                )}
                onClick={() => {
                  if (selectableRows && onRowSelected) onRowSelected(row);
                }}
              >
                {columns.map((column, index2) => (
                  <td style={column.style} key={index2}>
                    {column.content(row, index)}
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
