import React from "react";
import "./Footer.css";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="w-screen h-[8rem] flex justify-center items-center !p-[2rem] bg-[#001826]/10 backdrop-blur-md text-[#111111] dark:text-gray-400">
      © {new Date().getFullYear()}{" "}
      <span className="!mx-[0.5rem] text-[1rem]">|</span> Built by{" "}
      <Link to="https://bryanwaine.netlify.app" target="_blank">
        <p className="text-[#FF7B00] !ml-[0.3rem] underline underline-offset-8">
          Nwanne Ezeaka
        </p>
      </Link>
    </div>
  );
};

export default Footer;
