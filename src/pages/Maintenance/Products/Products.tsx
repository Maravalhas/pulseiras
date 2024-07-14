import moment from "moment";
import { useEffect, useState } from "react";
import {
  createProduct,
  getAllProducts,
  getAllProductsCategories,
  updateProduct,
} from "../../../axios/products";
import Table from "../../../components/Table/Table";
import Pagination from "../../../components/Table/Pagination";
import Button from "../../../components/Button/Button";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

type Product = {
  id?: number;
  name: string;
  description: string;
  id_category: number;
  category: string;
  stock: number;
  price: number;
};

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const [data, setData] = useState<any>({});
  const [offset, setOffset] = useState([10, 1]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(["name", "ASC"]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [categories, setCategories] = useState([]);

  function getData() {
    setLoading(true);
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
  }, [offset, search, order]);

  useEffect(() => {
    if (data.data) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getAllProductsCategories({}).then((res) => {
      setCategories(
        res.data.data.map((category: any) => ({
          label: category.name,
          value: category.id,
        }))
      );
    });
  }, []);

  const columns = [
    {
      title: "Nome",
      content: (row: any) => row.name,
      sort: "name",
      style: { width: "250px" },
    },
    {
      title: "Categoria",
      content: (row: any) => row.category,
      sort: "ProductsCategory.name",
    },
    {
      title: "Preço",
      content: (row: any) => row.price,
      sort: "price",
      style: { width: "100px", textAlign: "center" },
    },
    {
      title: "Stock",
      content: (row: any) => row.stock,
      sort: "stock",
      style: { width: "100px", textAlign: "center" },
    },
    {
      title: "Data Adição",
      content: (row: any) =>
        moment(row.createdAt).format("DD/MM/YYYY [às] HH:mm[h]"),
      sort: "createdAt",
      style: { width: "200px" },
    },
  ];

  function updateProductState(value: any, param: string) {
    setSelectedProduct(
      (selectedProduct) =>
        ({
          ...selectedProduct,
          [param]: value,
        } as Product)
    );
  }

  function submitCreateProduct() {
    const body = {
      name: selectedProduct?.name,
      description: selectedProduct?.description,
      id_category: selectedProduct?.id_category,
      stock: selectedProduct?.stock,
      price: selectedProduct?.price,
    };

    createProduct(body)
      .then(() => {
        toast.success("Produto criado com sucesso");
        setSelectedProduct(null);
        setSubmiting(false);
        getData();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Erro ao criar o produto");
        setSubmiting(false);
      });
  }

  function submitUpdateProduct() {
    const body = {
      name: selectedProduct?.name,
      description: selectedProduct?.description,
      id_category: selectedProduct?.id_category,
      stock: selectedProduct?.stock,
      price: selectedProduct?.price,
    };

    updateProduct(selectedProduct?.id!, body)
      .then(() => {
        toast.success("Produto atualizado com sucesso");
        setSelectedProduct(null);
        setSubmiting(false);
        getData();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Erro ao atualizar o produto"
        );
        setSubmiting(false);
      });
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="col-12 col-lg-7 pe-lg-3 mb-3 mb-lg-0">
        <div className="card card-shadow">
          <div className="card-header">
            <div className="card-title">Lista de produtos</div>
            <div className="card-toolbar text-muted">
              {data.total} produto{data?.total !== 1 && "s"}
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
              selectedRow={selectedProduct?.id}
              onRowSelected={(row: any) => {
                if (row.id !== selectedProduct?.id) {
                  setSelectedProduct(row);
                } else {
                  setSelectedProduct(null);
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
      <div className="col-12 col-lg-5">
        <div className="card card-shadow">
          <div className="card-header">
            <div className="card-title">Detalhes do produto</div>
            <div className="card-toolbar">
              <Button
                onClick={() => {
                  setSelectedProduct({} as Product);
                }}
                disabled={selectedProduct && !selectedProduct.id ? true : false}
              >
                Criar
              </Button>
            </div>
          </div>
          {selectedProduct ? (
            <form
              id="productForm"
              className="card-body py-2 px-0"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmiting(true);
                if (selectedProduct?.id) {
                  submitUpdateProduct();
                } else {
                  submitCreateProduct();
                }
              }}
            >
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  value={selectedProduct?.name || ""}
                  onChange={(e) => {
                    updateProductState(e.target.value, "name");
                  }}
                  placeholder="Nome do produto"
                  required
                  disabled={!selectedProduct}
                />
              </Form.Group>
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  value={selectedProduct?.description || ""}
                  onChange={(e) => {
                    updateProductState(e.target.value, "description");
                  }}
                  placeholder="Breve descrição sobre o produto"
                  as="textarea"
                  disabled={!selectedProduct}
                />
              </Form.Group>
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  required
                  value={selectedProduct?.id_category || ""}
                  onChange={(e) => {
                    updateProductState(+e.target.value, "id_category");
                  }}
                  disabled={!selectedProduct}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  {categories.map((category: any) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="inputName" className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Quantidade em stock"
                  value={selectedProduct?.stock || 0}
                  onChange={(e) => {
                    updateProductState(+e.target.value, "stock");
                  }}
                  disabled={!selectedProduct}
                />
              </Form.Group>
              <Form.Group controlId="inputName" className="mb-4">
                <Form.Label>Preço (€)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Preço do produto"
                  value={selectedProduct?.price || 0}
                  onChange={(e) => {
                    updateProductState(+e.target.value, "price");
                  }}
                  disabled={!selectedProduct}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  loading={submiting}
                  modifiers="me-3"
                  submit
                  disabled={!selectedProduct}
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-align-center my-5">
              <p className="fs-4 mb-0">Nenhum produto selecionado</p>
              <p className="mb-0">
                Selecione um produto da lista para o editar ou pressione criar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
