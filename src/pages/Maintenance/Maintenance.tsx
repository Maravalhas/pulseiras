import { Tab, Tabs } from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import Products from "./Products/Products";
import Shipping from "./Shipping/Shipping";
import Categories from "./Categories/Categories";
import { useEffect } from "react";

const Maintenance = () => {
  const navigate = useNavigate();
  const tab = useParams().id;

  useEffect(() => {
    if (!tab) {
      navigate("/maintenance/products");
    }
  }, []);

  return (
    <>
      <Breadcrumb locations={[{ title: "Manutenção" }]} />
      <div className="card">
        <div className="card-header">
          <div className="card-title">Manutenção</div>
        </div>
        <div className="card-body p-0 ">
          <Tabs
            activeKey={tab}
            onSelect={(key) => {
              navigate(`/maintenance/${key}`);
            }}
            className="my-2"
          >
            <Tab title="Produtos" eventKey="products">
              {tab === "products" ? <Products /> : null}
            </Tab>
            <Tab title="Categorias de Produtos" eventKey="categories">
              {tab === "categories" ? <Categories /> : null}
            </Tab>
            <Tab title="Métodos de Envio" eventKey="methods">
              {tab === "methods" ? <Shipping /> : null}
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
