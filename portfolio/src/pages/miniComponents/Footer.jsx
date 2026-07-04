import React from "react";
import { Reveal } from "@/components/reveal";

const Footer = () => {
  return (
    <Reveal as="footer" className="p-5 mt-6 w-full max-w-[1050px] mx-auto">
      <hr className="border-glass-border" />
      <h1 className="text-tubeLight-effect text-3xl mt-5 justify-center sm:justify-start tracking-[8px]">
        Thanks For Scrolling
      </h1>
    </Reveal>
  );
};

export default Footer;
