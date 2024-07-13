import { Link, useLocation } from "react-router-dom";
import menus from "../../assets/menus/menus.json";
import { clsx } from "../../utilities/helpers";
import Icon from "../Icon/Icon";

const BottomNavigation = () => {
  const location = useLocation().pathname;

  return (
    <div className="bottom-navigation">
      {menus.map((menu, index) => {
        return (
          <Link
            key={index}
            to={menu.to}
            className={clsx(
              "bottom-navigation-menu",
              location.startsWith(menu.to) && "active"
            )}
          >
            <Icon icon={menu.icon} weight="bold" />
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
