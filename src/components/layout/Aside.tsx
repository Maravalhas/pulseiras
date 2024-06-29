import { clsx } from "../../utilities/helpers";
import { Link, useLocation } from "react-router-dom";
import menus from "../../assets/menus/menus.json";
import Icon from "../Icon/Icon";
import { useContext } from "react";
import UserContext from "../../store/User";

const Aside = () => {
  const location = useLocation().pathname;

  const user = useContext(UserContext);

  return (
    <div className="aside">
      <div className="aside-user">
        <div className="aside-menu">{user.name?.substring(0, 1)}</div>
      </div>
      <div className="p-3">
        {menus.map((menu, index) => {
          return (
            <Link
              key={index}
              to={menu.to}
              className={clsx(
                "aside-menu",
                location.startsWith(menu.to) && "active"
              )}
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
