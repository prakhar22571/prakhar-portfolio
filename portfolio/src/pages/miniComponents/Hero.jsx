import { ExternalLink, Github, Linkedin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { scaleTap } from "@/lib/motion";
import api from "../../lib/api";

const Hero = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getMyProfile = async () => {
      const { data } = await api.get("/api/v1/user/portfolio/me");
      setUser(data.user);
    };
    getMyProfile();
  }, []);
  return (
    <RevealGroup className="w-full" stagger={0.12}>
      <GlassCard className="p-6 sm:p-10">
        <CardContent className="p-0">
          <RevealItem className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-glow-pulse rounded-full bg-green-400 shadow-glow-sm"></span>
            <p>Online</p>
          </RevealItem>
          <RevealItem
            as="h1"
            className="overflow-x-hidden text-[1.3rem] sm:text-[1.75rem]
          md:text-[2.2rem] lg:text-[2.8rem] tracking-[2px] mb-4"
          >
            Hey, I'm Prakhar
          </RevealItem>
          <RevealItem
            as="h1"
            className="text-tubeLight-effect overflow-x-hidden text-[1.3rem]
          sm:text-[1.75rem] md:text-[2.2rem] lg:text-[2.8rem] tracking-[15px]"
          >
            <Typewriter
              words={["AI ENGINEER", "BACKEND ENGINEER", "DEVOPS ENGINEER"]}
              loop={50}
              cursor
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </RevealItem>
          <RevealItem
            className="glass w-fit px-5 py-2 rounded-[20px] flex gap-5
          items-center mt-4 md:mt-8 lg:mt-10"
          >
            <Link to={user.linkedInURL} target="_blank">
              <Linkedin className="text-sky-500 w-7 h-7" />
            </Link>
          </RevealItem>
          <RevealItem className="mt-4 md:mt-8 lg:mt-10 flex gap-3">
            <Link to={user.githubURL} target="_blank">
              <m.div {...scaleTap}>
                <Button className="rounded-[30px] flex items-center gap-2 flex-row hover:shadow-glow">
                  <span>
                    <Github />
                  </span>
                  <span>Github</span>
                </Button>
              </m.div>
            </Link>
            <Link to={user.resume && user.resume.url} target="_blank">
              <m.div {...scaleTap}>
                <Button className="rounded-[30px] flex items-center gap-2 flex-row hover:shadow-glow">
                  <span>
                    <ExternalLink />
                  </span>
                  <span>Resume</span>
                </Button>
              </m.div>
            </Link>
          </RevealItem>
          <RevealItem
            as="p"
            className="mt-8 text-xl tracking-[2px] whitespace-pre-line"
          >
            {user.aboutMe}
          </RevealItem>
        </CardContent>
      </GlassCard>
    </RevealGroup>
  );
};

export default Hero;
