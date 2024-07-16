import { useMemo } from "react";
import { Pagination as BsPagination, Form } from "react-bootstrap";
import { clsx } from "../../utilities/helpers";

type Props = {
  pagination: number[];
  totalPages: number;
  setPagination: (value: number[]) => void;
  modifiers?: string;
};

const Pagination: React.FC<Props> = ({
  pagination,
  totalPages,
  setPagination,
  modifiers,
}) => {
  function previousPage() {
    if (pagination[1] > 1) {
      setPagination([pagination[0], pagination[1] - 1]);
    }
  }

  function nextPage() {
    if (pagination[1] < totalPages) {
      setPagination([pagination[0], pagination[1] + 1]);
    }
  }

  function updatePage(value: number) {
    setPagination([pagination[0], +value]);
  }

  const pageNumber = useMemo(() => {
    let pages: any = {
      2: 0,
      3: 0,
      4: 0,
    };

    Object.keys(pages).forEach((number: string) => {
      switch (+number) {
        case 2: {
          if (pagination[1] <= 3 || (pagination[1] === 4 && totalPages === 4)) {
            pages[number] = 2;
          } else if (pagination[1] >= totalPages - 1 && totalPages > 3) {
            pages[number] = totalPages - 3;
          } else {
            pages[number] = pagination[1] - 1;
          }
          break;
        }
        case 3: {
          if (totalPages === 4 || pagination[1] <= 3) {
            pages[number] = 3;
          } else if (pagination[1] >= totalPages - 1) {
            pages[number] = totalPages - 2;
          } else {
            pages[number] = pagination[1];
          }
          break;
        }
        case 4: {
          if (totalPages === 4 || pagination[1] <= 3) {
            pages[number] = 4;
          } else if (pagination[1] >= totalPages - 1) {
            pages[number] = totalPages - 1;
          } else {
            pages[number] = pagination[1] + 1;
          }
          break;
        }
      }
    });

    return pages;
  }, [pagination, totalPages]);

  return (
    <div
      className={clsx(
        "d-flex justify-content-between col-12",
        modifiers && modifiers
      )}
    >
      <Form.Select
        required
        value={pagination[0] || ""}
        onChange={(e: any) => {
          setPagination([+e.target.value, pagination[1]]);
        }}
        style={{ width: "80px" }}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Form.Select>
      <BsPagination className="pagination">
        <BsPagination.Prev onClick={previousPage}></BsPagination.Prev>
        <BsPagination.Item
          onClick={() => {
            updatePage(1 as number);
          }}
          active={pagination[1] === 1}
        >
          1
        </BsPagination.Item>
        <BsPagination.Ellipsis
          className={clsx((totalPages < 5 || pagination[1] < 4) && "d-none")}
        />
        <BsPagination.Item
          onClick={() => {
            updatePage(pageNumber[2] as number);
          }}
          className={clsx(totalPages < 2 && "d-none")}
          active={pagination[1] === pageNumber[2]}
        >
          {pageNumber[2]}
        </BsPagination.Item>
        <BsPagination.Item
          onClick={() => {
            updatePage(pageNumber[3] as number);
          }}
          className={clsx(totalPages < 3 && "d-none")}
          active={pagination[1] === pageNumber[3]}
        >
          {pageNumber[3]}
        </BsPagination.Item>
        <BsPagination.Item
          onClick={() => {
            updatePage(pageNumber[4] as number);
          }}
          className={clsx(totalPages < 4 && "d-none")}
          active={pagination[1] === pageNumber[4]}
        >
          {pageNumber[4]}
        </BsPagination.Item>
        <BsPagination.Ellipsis
          className={clsx(
            (totalPages < 5 || pagination[1] >= totalPages - 1) && "d-none"
          )}
        />
        <BsPagination.Item
          onClick={() => {
            updatePage(totalPages as number);
          }}
          className={clsx(totalPages < 5 && "d-none")}
          active={pagination[1] === totalPages}
        >
          {totalPages}
        </BsPagination.Item>
        <BsPagination.Next onClick={nextPage}></BsPagination.Next>
      </BsPagination>
    </div>
  );
};

export default Pagination;
