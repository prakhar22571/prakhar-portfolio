import React from "react";
import Hero from "./miniComponents/Hero";
import Timeline from "./miniComponents/Timeline";
import Skills from "./miniComponents/Skills";
import MyApps from "./miniComponents/MyApps";
import About from "./miniComponents/About";
import Portfolio from "./miniComponents/Portfolio";
import Contact from "./miniComponents/Contact";
import Footer from "./miniComponents/Footer";
import { Loader } from "@/components/loader";
import {
  PortfolioDataProvider,
  usePortfolioData,
} from "@/context/portfolio-data";

const HomeContent = () => {
  const { status, reload } = usePortfolioData();

  if (status !== "ready") {
    return <Loader error={status === "error"} onRetry={reload} />;
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-70"
      />
      <article className="px-5 mt-10 sm:mt-14 md:mt-16 lg:mt-24 xl:mt-32 sm:mx-auto w-full max-w-[1050px] flex flex-col gap-14">
        <Hero />
        <Timeline />
        <About />
        <Skills />
        <Portfolio />
        <MyApps />
        <Contact />
      </article>
      <Footer />
    </div>
  );
};

const Home = () => (
  <PortfolioDataProvider>
    <HomeContent />
  </PortfolioDataProvider>
);

export default Home;
