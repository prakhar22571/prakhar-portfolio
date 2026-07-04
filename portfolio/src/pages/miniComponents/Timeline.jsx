import api from "../../lib/api";
import React, { useEffect, useState } from "react";
import { RevealGroup, RevealItem } from "@/components/reveal";

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  useEffect(() => {
    const getMyTimeline = async () => {
      const { data } = await api.get("/api/v1/timeline/getall");
      setTimeline(data.timelines);
    };
    getMyTimeline();
  }, []);
  return (
    <div>
      <h1 className="overflow-x-hidden text-[2rem] sm:text-[1.75rem] md:text-[2.2rem] lg:text-[2.8rem] mb-4 font-extrabold">
        Timeline
      </h1>
      <RevealGroup as="ol" className="relative border-s border-glass-border">
        {timeline &&
          timeline.map((element) => {
            return (
              <RevealItem as="li" className="mb-10 ms-6" key={element._id}>
                <span className="glass absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 shadow-glow-sm">
                  <svg
                    className="w-2.5 h-2.5 text-primary"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-foreground">
                  {element.title}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                  {element.timeline.from} -{" "}
                  {element.timeline.to ? element.timeline.to : "Present"}
                </time>
                <p className="text-base font-normal text-muted-foreground">
                  {element.description}
                </p>
              </RevealItem>
            );
          })}
      </RevealGroup>
    </div>
  );
};

export default Timeline;
