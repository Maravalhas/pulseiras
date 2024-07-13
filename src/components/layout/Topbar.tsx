import { List } from "@phosphor-icons/react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import menus from "../../assets/menus/menus.json";
import React from "react";

const Topbar = () => {
  return (
    <div className="topbar">
      <Dropdown className="aside-toggle-mobile me-3" autoClose>
        <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
        <Dropdown.Menu rootCloseEvent="click">
          {menus.map((menu, index) => (
            <Dropdown.ItemText>
              <Link key={index} to={menu.to} className="my-1">
                {menu.title}
              </Link>
            </Dropdown.ItemText>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Link to="/" className="title">
        Rose Colored Bracelets
      </Link>
    </div>
  );
};

export default Topbar;

const CustomToggle = React.forwardRef<any, any>((props, ref) => {
  return (
    <div {...props} ref={ref} className="btn btn-secondary py-1 px-2">
      <List size={22} color="white" />
    </div>
  );
});
