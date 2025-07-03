import React from "react";
import { Link } from "react-router";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="w-screen h-[8rem] flex justify-center items-center !p-[2rem] bg-[#001826]/10 backdrop-blur-md text-[#111111] dark:text-gray-400 border border-transparent border-t-[#cccccc] ">
      © {new Date().getFullYear()}{" "}
      <span className="!mx-[0.5rem] text-[1rem]">|</span> Built by{" "}
      <Link to="https://bryanwaine.netlify.app" target="_blank">
        <p className="text-[#FF7B00] !ml-[0.3rem] underline underline-offset-8">
          Bryan Ezeaka
        </p>
      </Link>
    </footer>
  );
};

export default Footer;
