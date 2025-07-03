import React from "react";

import { Link } from "react-router";

import "./LogoLg.css";

const LogoLg = ({variant}) => {
  return (
    <Link to="/" className="bg-[#001826] flex justify-center items-center !px-2 !py-1 border-none rounded-lg">
      <p className={`logo logo-${variant} text-white text-bold text-4xl`}>
        Auxili<span className="text-[#FF7B00]">ai</span>re
      </p>
    </Link>
  );
};

export default LogoLg;
