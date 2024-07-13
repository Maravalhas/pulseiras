import { ReactNode, useMemo, useRef } from "react";
import { clsx } from "../../utilities/helpers";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

type Props = {
  data: any;
  columns: {
    title?: string;
    content: (row: any, index: number) => ReactNode | string;
    style?: any;
    sort?: string;
    button?: boolean;
  }[];
  loading?: boolean;
  sort?: string[];
  setSort?: (value: string[]) => void;
  selectableRows?: boolean;
  onRowSelected?: (row: any) => void;
  selectedRow?: number;
  modifiers?: string;
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
  modifiers,
}) => {
  const ref = useRef<any>(null);

  const useSort = useMemo(() => {
    return sort && setSort;
  }, [sort, setSort]);

  return (
    <div className={clsx("table-wrapper", modifiers && modifiers)}>
      <table className="table" ref={ref}>
        <thead>
          <tr>
            {columns.map((column, index) => {
              const sorting =
                useSort && column.sort && sort![0] === column.sort;
              return (
                <td
                  className={clsx(useSort && column.sort ? "pointer" : "")}
                  style={{
                    ...column.style,
                    width: column.style?.width,
                    minWidth: column.style?.width,
                    maxWidth: column.style?.width,
                  }}
                  key={index}
                  onClick={() => {
                    if (useSort && column.sort) {
                      if (sort![0] === column.sort) {
                        setSort!([
                          column.sort,
                          sort![1] === "ASC" ? "DESC" : "ASC",
                        ]);
                      } else {
                        setSort!([column.sort, "ASC"]);
                      }
                    }
                  }}
                >
                  {column.title}{" "}
                  {sorting ? (
                    <>
                      {sort![1] === "ASC" ? (
                        <CaretUp weight="bold" />
                      ) : (
                        <CaretDown weight="bold" />
                      )}
                    </>
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
                  <td
                    style={{
                      ...column.style,
                      width: column.style?.width,
                      minWidth: column.style?.width,
                      maxWidth: column.style?.width,
                    }}
                    key={index2}
                    onClick={(e) => {
                      if (column.button) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {column.content(row, index)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length} className="text-align-center p-3">
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
