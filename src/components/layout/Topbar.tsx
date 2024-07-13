import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="topbar">
      <Link to="/home" className="title">
        Rose Colored Bracelets
      </Link>
    </div>
  );
};

export default Topbar;
