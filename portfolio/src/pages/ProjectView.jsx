import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { m } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { scaleTap } from "@/lib/motion";

const ProjectView = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [deployed, setDeployed] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getProject = async () => {
      await api
        .get(`/api/v1/project/get/${id}`)
        .then((res) => {
          setTitle(res.data.project.title);
          setDescription(res.data.project.description);
          setStack(res.data.project.stack);
          setDeployed(res.data.project.deployed);
          setTechnologies(res.data.project.technologies);
          setGitRepoLink(res.data.project.gitRepoLink);
          setProjectLink(res.data.project.projectLink);
          setProjectBanner(
            res.data.project.projectBanner && res.data.project.projectBanner.url
          );
          setProjectBannerPreview(
            res.data.project.projectBanner && res.data.project.projectBanner.url
          );
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || error.message);
        });
    };
    getProject();
  }, [id]);

  const descriptionList = description.split(". ");
  const technologiesList = technologies.split(", ");

  const navigateTo = useNavigate();
  const handleReturnToPortfolio = () => {
    navigateTo("/");
  };

  return (
    <div className="flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4">
      <div className="w-[100%] px-5 md:w-[1000px] pb-5">
        <GlassCard>
          <CardContent className="p-6 sm:p-10">
            <div className="flex justify-end mb-6">
              <m.div {...scaleTap} className="inline-block">
                <Button onClick={handleReturnToPortfolio} className="hover:shadow-glow">
                  Return to Portfolio
                </Button>
              </m.div>
            </div>
            <RevealGroup as="div" className="flex flex-col gap-5" stagger={0.1}>
              <RevealItem className="w-full sm:col-span-4">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <img
                  src={
                    projectBannerPreview
                      ? projectBannerPreview
                      : "/avatarHolder.jpg"
                  }
                  alt="projectBanner"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto rounded-xl shadow-glass"
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Description:</p>
                <ul className="list-disc">
                  {descriptionList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Technologies:</p>
                <ul className="list-disc">
                  {technologiesList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Stack:</p>
                <p>{stack}</p>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Deployed:</p>
                <p>{deployed}</p>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Github Repository Link:</p>
                <Link className="text-sky-400" target="_blank" to={gitRepoLink}>
                  {gitRepoLink}
                </Link>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Project Link:</p>
                <Link className="text-sky-400" target="_blank" to={projectLink}>
                  {projectLink}
                </Link>
              </RevealItem>
            </RevealGroup>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProjectView;
