import { ChartLine, List, Package } from "@phosphor-icons/react";
import { Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "../../utilities/helpers";

const Topbar = () => {
  const location = useLocation().pathname;

  return (
    <div className="topbar">
      <Dropdown className="aside-toggle-mobile me-3">
        <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
        <Dropdown.Menu></Dropdown.Menu>
      </Dropdown>
      <Link to="/home" className="title">
        Rose Colored Bracelets
      </Link>
    </div>
  );
};

export default Topbar;

const CustomToggle = (props: any) => {
  return (
    <div {...props} className="btn btn-secondary py-1 px-2">
      <List size={22} color="white" />
    </div>
  );
};
