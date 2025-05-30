import { Link } from "react-router-dom";
import { Tab, Ripple, initMDB } from "mdb-ui-kit";
import { useEffect } from 'react';
import "../styles/FormTabs.css";

const FormTabs = ({ activeTab }) => {
  useEffect(() => {
    initMDB({ Tab, Ripple });
  }, []);

  return (
    <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
      <li className="nav-item" role="presentation">
        <Link
          className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
          id="tab-login"
          to="/login"
          role="tab"
        >
          Login
        </Link>
      </li>
      <li className="nav-item" role="presentation">
        <Link
          className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
          id="tab-register"
          to="/register"
          role="tab"
        >
          Register
        </Link>
      </li>
    </ul>
  );
};

export default FormTabs;