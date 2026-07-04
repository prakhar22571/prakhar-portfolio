import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../lib/api";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import {
  clearAllProjectErrors,
  getAllProjects,
  resetProjectSlice,
  updateProject,
} from "@/store/slices/projectSlice";
import { Button } from "@/components/ui/button";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { RevealGroup, RevealItem } from "@/components/reveal";

const UpdateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [deployed, setDeployed] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");

  const { error, message, loading } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleProjectBanner = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectBannerPreview(reader.result);
      setProjectBanner(file);
    };
  };

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

    if (error) {
      toast.error(error);
      dispatch(clearAllProjectErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetProjectSlice());
      dispatch(getAllProjects());
    }
  }, [id, message, error]);

  const handleUpdateProject = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deployed", deployed);
    formData.append("stack", stack);
    formData.append("technologies", technologies);
    formData.append("gitRepoLink", gitRepoLink);
    formData.append("projectLink", projectLink);
    formData.append("projectBanner", projectBanner);
    dispatch(updateProject(id, formData));
  };

  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  return (
    <div className="relative flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 px-5">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <form
        onSubmit={handleUpdateProject}
        className="w-[100%] md:w-[1000px] pb-5"
      >
        <GlassCard>
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col gap-2 items-start justify-between sm:items-center sm:flex-row mb-8">
              <h2 className="font-semibold leading-7 text-3xl">
                UPDATE PROJECT
              </h2>
              <Button onClick={handleReturnToDashboard} className="hover:shadow-glow">
                Return to Dashboard
              </Button>
            </div>
            <RevealGroup as="div" className="flex flex-col gap-5" stagger={0.06}>
              <RevealItem className="w-full sm:col-span-4">
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
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleProjectBanner}
                    className="avatar-update-btn mt-4 w-full"
                  />
                </div>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Project Title</Label>
                <Input
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="MERN STACK PORTFOLIO"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Description</Label>
                <Textarea
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="Feature 1. Feature 2. Feature 3."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Technologies Uses In This Project</Label>
                <Textarea
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="HTML, CSS, JAVASCRIPT, REACT"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Stack</Label>
                <div className="mt-2">
                  <Select
                    value={stack}
                    onValueChange={(selectedValue) => setStack(selectedValue)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project Stack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Stack">Full Stack</SelectItem>
                      <SelectItem value="Mern">MERN</SelectItem>
                      <SelectItem value="Mean">MEAN</SelectItem>
                      <SelectItem value="Next.JS">NEXT.JS</SelectItem>
                      <SelectItem value="React.JS">REACT.JS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Deployed</Label>
                <div className="mt-2">
                  <Select
                    value={deployed}
                    onValueChange={(selectedValue) => setDeployed(selectedValue)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Is this project deployed?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Github Repository Link</Label>
                <div className="relative mt-2">
                  <LinkIcon className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9 focus-visible:shadow-glow-sm"
                    placeholder="Github Repository Link"
                    value={gitRepoLink}
                    onChange={(e) => setGitRepoLink(e.target.value)}
                  />
                </div>
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Project Link</Label>
                <div className="relative mt-2">
                  <LinkIcon className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9 focus-visible:shadow-glow-sm"
                    placeholder="Project Link"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                  />
                </div>
              </RevealItem>
            </RevealGroup>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              {loading ? (
                <SpecialLoadingButton content={"Updating"} width={"w-52"} />
              ) : (
                <Button type="submit" className="w-52 hover:shadow-glow">
                  Update
                </Button>
              )}
            </div>
          </CardContent>
        </GlassCard>
      </form>
    </div>
  );
};

export default UpdateProject;
