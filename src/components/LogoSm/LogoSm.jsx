import { Link } from "react-router";

import "./LogoSm.css";

const LogoSm = ({variant}) => {
  return (
    <Link to="/" className="bg-[#001826] flex justify-center items-center !px-2 !py-1 border-none">
      <p className={`logo logo-${variant} !text-white text-bold text-2xl`}>
      Auxili<span className="text-[#FF7B00]">ai</span>re
      </p>
    </Link>
  );
};

export default LogoSm;