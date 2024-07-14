import { Form } from "react-bootstrap";
import Table from "../../../components/Table/Table";
import { useEffect, useState } from "react";
import Pagination from "../../../components/Table/Pagination";
import Button from "../../../components/Button/Button";
import moment from "moment";
import {
  createProductsCategories,
  getAllProductsCategories,
  updateProductsCategories,
} from "../../../axios/products_categories";
import { toast } from "react-toastify";

type Category = {
  id: number;
  name: string;
  description: string;
};

const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(["name", "ASC"]);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  function getData() {
    setLoading(true);
    getAllProductsCategories({
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

  function updateCategoryState(value: any, key: string) {
    setSelectedCategory(
      (selectedCategory) =>
        ({
          ...selectedCategory,
          [key]: value,
        } as Category)
    );
  }

  const columns = [
    {
      title: "Nome",
      content: (row: any) => row.name,
      sort: "name",
    },
    {
      title: "Descrição",
      content: (row: any) => row.description || "-",
      sort: "description",
    },
    {
      title: "Data adição",
      content: (row: any) =>
        moment(row.createdAt).format("DD/MM/YYYY [às] HH:mm[h]"),
      sort: "createdAt",
      style: { width: "200px" },
    },
  ];

  function submitCreateCategory() {
    const body = {
      name: selectedCategory!.name,
      description: selectedCategory!.description,
    };

    createProductsCategories(body)
      .then(() => {
        toast.success("Categoria criada com sucesso");
        setSelectedCategory(null);
        setSubmiting(false);
        getData();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Erro ao criar categoria");
        setSubmiting(false);
      });
  }

  function submitUpdateCategory() {
    const body = {
      name: selectedCategory!.name,
      description: selectedCategory!.description,
    };

    updateProductsCategories(selectedCategory!.id, body)
      .then(() => {
        toast.success("Categoria atualizada com sucesso");
        setSelectedCategory(null);
        setSubmiting(false);
        getData();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Erro ao atualizar categoria"
        );
        setSubmiting(false);
      });
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="col-12 col-lg-6 pe-lg-3 mb-3 mb-lg-0">
        <div className="card card-shadow">
          <div className="card-header">
            <div className="card-title">Lista de categorias</div>
            <div className="card-toolbar text-muted">
              {data.total} categoria{data?.total !== 1 && "s"}
            </div>
          </div>
          <div className="card-body p-0 mt-1">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
              <div className="d-flex">
                <Form.Control
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            <Table
              data={data.data}
              columns={columns}
              loading={loading}
              sort={order}
              setSort={setOrder}
              selectableRows
              selectedRow={selectedCategory?.id}
              onRowSelected={(row: any) => {
                if (row.id !== selectedCategory?.id) {
                  setSelectedCategory(row);
                } else {
                  setSelectedCategory(null);
                }
              }}
              modifiers="mb-3"
            />
            <div className="d-flex justify-content-center mb-2">
              <Pagination
                pagination={offset}
                setPagination={setOffset}
                totalPages={data.total ? Math.ceil(data.total / offset[0]) : 0}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="card card-shadow">
          <div className="card-header">
            <div className="card-title">Detalhes da categoria</div>
            <div className="card-toolbar">
              <Button
                onClick={() => {
                  setSelectedCategory({} as Category);
                }}
                disabled={
                  selectedCategory && !selectedCategory.id ? true : false
                }
              >
                Criar
              </Button>
            </div>
          </div>
          {selectedCategory ? (
            <form
              id="productForm"
              className="card-body py-2 px-0"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmiting(true);
                if (selectedCategory?.id) {
                  submitUpdateCategory();
                } else {
                  submitCreateCategory();
                }
              }}
            >
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  value={selectedCategory?.name || ""}
                  onChange={(e) => {
                    updateCategoryState(e.target.value, "name");
                  }}
                  placeholder="Nome da categoria"
                  required
                  disabled={!selectedCategory}
                />
              </Form.Group>
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  value={selectedCategory?.description || ""}
                  onChange={(e) => {
                    updateCategoryState(e.target.value, "description");
                  }}
                  placeholder="Breve descrição sobre a categoria"
                  disabled={!selectedCategory}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  loading={submiting}
                  modifiers="me-3"
                  submit
                  disabled={!selectedCategory}
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                  }}
                  disabled={!selectedCategory}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-align-center my-5">
              <p className="fs-4 mb-0">Nenhuma categoria selecionada</p>
              <p className="mb-0">
                Selecione uma categoria lista para a editar ou pressione criar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
