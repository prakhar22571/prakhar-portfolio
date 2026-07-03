import React, { useEffect, useState } from "react";

const About = () => {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <div className="relative">
        <h1
          className="flex gap-4 items-center text-[2rem] sm:text-[2.75rem] 
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] 
          lg:leading-[90px] tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{
            background: "hsl(222.2 84% 4.9%)",
          }}
        >
          ABOUT <span className="text-tubeLight-effect font-extrabold">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200"></span>
      </div>
      <div className="text-center">
        <p className="uppercase text-xl text-slate-400">
          My Introduction
        </p>
      </div>
      <div>
        <div className="grid md:grid-cols-2 my-8 sm:my-20 gap-14">
          <div className="flex justify-center items-center">
            <img
              src="/me.jpg"
              alt="avatar"
              className="h-[240px] sm:h-[340px] md:h-[350px] lg:h-[450px] w-[180px] sm:w-[255px] md:w-[263px] lg:w-[338px] object-cover rounded-[2.5rem]"
            />
          </div>
          <div className="flex justify-center flex-col tracking-[1px] text-xl gap-5">
            <p>
              I'm Prakhar Rai, a Software Engineer at UKG building large-scale
              developer platforms, CI/CD infrastructure, and internal AI
              tooling. I hold a B.Tech in Computer Science & Engineering from
              the Indian Institute of Information Technology, Bhagalpur
              (2021 - 2025), and I work at the intersection of backend
              engineering, cloud infrastructure, and practical AI systems.
            </p>
            <p className="tracking-[1px] text-xl">
              I'm a Top 1.3% LeetCode Guardian and a Codeforces Expert, and
              outside of work I build end-to-end systems that solve real
              engineering problems — from an offline AI code review assistant
              to a Bluetooth Mesh-based offline UPI payment system for
              low-connectivity environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
