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
import { Button } from "@/components/ui/button";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { Link as LinkIcon, ImagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addNewProject,
  clearAllProjectErrors,
  getAllProjects,
  resetProjectSlice,
} from "@/store/slices/projectSlice";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { RevealGroup, RevealItem } from "@/components/reveal";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [deployed, setDeployed] = useState("");

  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectBannerPreview(reader.result);
      setProjectBanner(file);
    };
  };

  const { loading, error, message } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const handleAddNewProject = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("gitRepoLink", gitRepoLink);
    formData.append("projectLink", projectLink);
    formData.append("technologies", technologies);
    formData.append("stack", stack);
    formData.append("deployed", deployed);
    formData.append("projectBanner", projectBanner);
    dispatch(addNewProject(formData));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllProjectErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetProjectSlice());
      dispatch(getAllProjects());
    }
  }, [dispatch, error, loading, message]);

  return (
    <div className="relative flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 px-5">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <form
        onSubmit={handleAddNewProject}
        className="w-[100%] md:w-[1000px]"
      >
        <GlassCard>
          <CardContent className="p-6 sm:p-10">
            <h2 className="font-semibold leading-7 text-3xl mb-8">
              ADD NEW PROJECT
            </h2>
            <RevealGroup as="div" className="flex flex-col gap-5" stagger={0.06}>
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
                <Label>Technologies Used In This Project</Label>
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

              <RevealItem className="w-full col-span-full">
                <Label htmlFor="cover-photo">Project Banner</Label>
                <div className="glass mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                  <div className="text-center">
                    {projectBannerPreview ? (
                      <img
                        className="mx-auto h-[250px] w-full rounded-md object-contain"
                        src={projectBannerPreview}
                        alt="project banner preview"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                    )}

                    <div className="mt-4 flex justify-center text-sm leading-6">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-primary hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleSvg}
                        />
                      </label>
                      <p className="pl-1 text-muted-foreground">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </RevealItem>
            </RevealGroup>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              {loading ? (
                <SpecialLoadingButton
                  content={"ADDING NEW PROJECT"}
                  width={"w-56"}
                />
              ) : (
                <Button type="submit" className="w-56 hover:shadow-glow">
                  Add Project
                </Button>
              )}
            </div>
          </CardContent>
        </GlassCard>
      </form>
    </div>
  );
};

export default AddProject;
