import clsx from "clsx";
import { Breadcrumb as BsBreadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Props = {
  locations?: { to?: string; title: string }[];
};

const Breadcrumb: React.FC<Props> = ({ locations }) => {
  const navigate = useNavigate();

  return (
    <BsBreadcrumb className="breadcrumb">
      <BsBreadcrumb.Item
        onClick={() => {
          navigate("/home");
        }}
        active={!locations?.length}
        className="link"
      >
        Início
      </BsBreadcrumb.Item>
      {locations?.map((location, index) => {
        return (
          <BsBreadcrumb.Item
            key={index}
            onClick={() => {
              if (location.to) navigate(location.to);
            }}
            active={index === locations.length - 1}
            className={clsx(location.to && "link")}
          >
            {location.title}
          </BsBreadcrumb.Item>
        );
      })}
    </BsBreadcrumb>
  );
};

export default Breadcrumb;
