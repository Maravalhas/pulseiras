import { ChartLine, Package, StackPlus } from "@phosphor-icons/react";
import { clsx } from "../../utilities/helpers";
import { Link, useLocation } from "react-router-dom";

const Aside = () => {
  const location = useLocation().pathname;

  return (
    <div className="aside">
      <div className="aside-user">
        <div className="aside-menu">M</div>
      </div>
      <div className="p-3">
        <Link
          to="/orders"
          className={clsx("aside-menu", location === "/orders" && "active")}
        >
          <Package size={26} weight="bold" />
        </Link>
        <Link
          to="/dashboard"
          className={clsx("aside-menu", location === "/dashboard" && "active")}
        >
          <ChartLine size={26} weight="bold" />
        </Link>
        <Link
          to="/stock"
          className={clsx("aside-menu", location === "/stock" && "active")}
        >
          <StackPlus size={26} weight="bold" />
        </Link>
      </div>
    </div>
  );
};

export default Aside;
