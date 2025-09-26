import { Link } from "react-router-dom";
import "../Css/Breadcrumb.css";

function Breadcrumb({ paths }) {
  return (
    <nav className="breadcrumb">
      {paths.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < paths.length - 1 && (
            <span className="separator"> &gt; </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
