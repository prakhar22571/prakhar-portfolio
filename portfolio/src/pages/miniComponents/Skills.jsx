import { GlassCard } from "@/components/ui/glass-card";
import api from "../../lib/api";
import React, { useEffect, useState } from "react";
import { RevealGroup, RevealItem } from "@/components/reveal";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const getMySkills = async () => {
      const { data } = await api.get("/api/v1/skill/getall");
      setSkills(data.skills);
    };
    getMySkills();
  }, []);
  return (
    <div className="w-full flex flex-col gap-8 sm:gap-12">
      <h1
        className="text-tubeLight-effect text-[2rem] sm:text-[2.75rem] md:text-[3rem]
      lg:text-[3.8rem] tracking-[15px] dancing_text mx-auto w-fit bg-background"
      >
        SKILLS
      </h1>
      <RevealGroup
        as="div"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {skills &&
          skills.map((element) => {
            return (
              <RevealItem key={element._id} whileHover={{ y: -4, scale: 1.05 }}>
                <GlassCard className="h-fit p-7 flex flex-col justify-center items-center gap-3">
                  <img
                    src={element.svg && element.svg.url}
                    alt="skill"
                    loading="lazy"
                    decoding="async"
                    className="h-12 sm:h-24 w-auto"
                  />
                  <p className="text-muted-foreground text-center">
                    {element.title}
                  </p>
                </GlassCard>
              </RevealItem>
            );
          })}
      </RevealGroup>
    </div>
  );
};

export default Skills;
