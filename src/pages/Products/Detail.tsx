import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import { createProduct, getAllProcuctsCategories } from "../../axios/products";
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

const Detail = () => {
  const navigate = useNavigate();

  const productId = +useParams().id!;

  const [submiting, setSubmiting] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  function updateProduct(value: any, param: string) {
    setProduct({
      ...product,
      [param]: value,
    } as Product);
  }

  useEffect(() => {
    if (productId) {
    } else {
      setProduct({} as Product);
    }
  }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllProcuctsCategories({}).then((res) => {
      setCategories(
        res.data.data.map((category: any) => ({
          label: category.name,
          value: category.id,
        }))
      );
    });
  }, []);

  function submitCreateProduct() {
    const body = {
      name: product?.name,
      description: product?.description,
      id_category: product?.id_category,
      stock: product?.stock,
      price: product?.price,
    };

    createProduct(body)
      .then(() => {
        toast.success("Produto criado com sucesso");
        navigate("/products/list");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Erro ao criar o produto");
        setSubmiting(false);
      });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          {productId ? "Detalhe do produto" : "Novo produto"}
        </div>
        <div className="card-toolbar">
          <Button
            modifiers="me-3"
            loading={submiting}
            form="productForm"
            submit
          >
            Guardar
          </Button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("/products/list");
            }}
          >
            Voltar
          </button>
        </div>
      </div>
      <form
        id="productForm"
        className="card-body px-0"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmiting(true);
          if (productId) {
            // submitUpdateProduct();
          } else {
            submitCreateProduct();
          }
        }}
      >
        <div className="info-card">
          <div className="info-card-title">
            <p>Dados Gerais</p>
          </div>
          <div className="info-card-body">
            <Form.Group controlId="inputName" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={product?.name || ""}
                onChange={(e) => {
                  updateProduct(e.target.value, "name");
                }}
                placeholder="Nome do produto"
                required
              />
            </Form.Group>
            <Form.Group controlId="inputName" className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                value={product?.description || ""}
                onChange={(e) => {
                  updateProduct(e.target.value, "description");
                }}
                placeholder="Breve descrição sobre o produto"
                as="textarea"
              />
            </Form.Group>
            <Form.Group controlId="inputName">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                required
                value={product?.id_category || ""}
                onChange={(e) => {
                  updateProduct(+e.target.value, "id_category");
                }}
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
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-title">
            <p>Dados Financeiros</p>
          </div>
          <div className="info-card-body">
            <Form.Group controlId="inputName" className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantidade em stock"
                value={product?.stock || 0}
                onChange={(e) => {
                  updateProduct(+e.target.value, "stock");
                }}
              />
            </Form.Group>
            <Form.Group controlId="inputName">
              <Form.Label>Preço (€)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Preço do produto"
                value={product?.price || 0}
                onChange={(e) => {
                  updateProduct(+e.target.value, "price");
                }}
              />
            </Form.Group>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-title"></div>
          <div className="info-card-body">
            <div className="d-flex justify-content-end">
              <Button loading={submiting} modifiers="me-3" submit>
                Guardar
              </Button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  navigate("/products/list");
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Detail;
