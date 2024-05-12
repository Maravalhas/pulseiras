import { clsx } from "../../utilities/helpers";
import { Link, useLocation } from "react-router-dom";
import menus from "../../assets/menus/menus.json";
import Icon from "../Icon/Icon";

const Aside = () => {
  const location = useLocation().pathname;

  return (
    <div className="aside">
      <div className="aside-user">
        <div className="aside-menu"></div>
      </div>
      <div className="p-3">
        {menus.map((menu) => {
          return (
            <Link
              to={menu.to}
              className={clsx("aside-menu", location === menu.to && "active")}
            >
              <Icon icon={menu.icon} weight="bold" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Aside;
