import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import api from "../../lib/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { scaleTap } from "@/lib/motion";

const Portfolio = () => {
  const [viewAll, setViewAll] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const getMyProjects = async () => {
      const { data } = await api.get("/api/v1/project/getall");
      setProjects(data.projects);
    };
    getMyProjects();
  }, []);

  const visibleProjects = viewAll ? projects : projects.slice(0, 9);

  return (
    <div>
      <div className="relative mb-12">
        <h1
          className="hidden sm:flex gap-4 items-center text-[2rem] sm:text-[2.75rem] md:text-[3rem]
          lg:text-[3.8rem] leading-[56px] md:leading-[67px] lg:leading-[90px] tracking-[15px]
          mx-auto w-fit font-extrabold about-h1 bg-background"
        >
          MY{" "}
          <span className="text-tubeLight-effect font-extrabold mr-[-15px]">
            PORTFOLIO
          </span>
        </h1>
        <h1
          className="flex sm:hidden gap-4 items-center text-[2rem] sm:text-[2.75rem]
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] lg:leading-[90px]
          tracking-[15px] mx-auto w-fit font-extrabold about-h1 bg-background"
        >
          MY <span className="text-tubeLight-effect font-extrabold mr-[-15px]">WORK</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-border"></span>
      </div>
      <RevealGroup as="div" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects &&
          visibleProjects.map((element) => {
            return (
              <RevealItem key={element._id} whileHover={{ y: -6 }}>
                <Link to={`/project/${element._id}`}>
                  <GlassCard className="group overflow-hidden p-2 hover:shadow-glow">
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={element.projectBanner && element.projectBanner.url}
                        alt={element.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </GlassCard>
                </Link>
              </RevealItem>
            );
          })}
      </RevealGroup>
      {projects && projects.length > 9 && (
        <div className="w-full text-center my-9">
          <m.div className="inline-block" {...scaleTap}>
            <Button className="w-52" onClick={() => setViewAll(!viewAll)}>
              {viewAll ? "Show Less" : "Show More"}
            </Button>
          </m.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
