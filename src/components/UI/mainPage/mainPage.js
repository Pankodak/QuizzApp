import React from "react";
import { Link } from "react-router-dom";
import "./mainPage.css";

const MainPage = () => {
  return (
    <div className="mainPage">
      <Link className="navigationButton center" to="/linux">
        Linux
      </Link>
      <Link className="navigationButton center" to="/windows">
        Windows
      </Link>
      <Link className="navigationButton" to="/admin">
        Dostęp administratorski
      </Link>
    </div>
  );
};

export default MainPage;
