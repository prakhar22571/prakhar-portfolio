import {
  addNewSkill,
  clearAllSkillErrors,
  getAllSkills,
  resetSkillSlice,
} from "@/store/slices/skillSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { ImagePlus } from "lucide-react";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { RevealGroup, RevealItem } from "@/components/reveal";

const AddSkill = () => {
  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [svg, setSvg] = useState("");
  const [svgPreview, setSvgPreview] = useState("");

  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSvgPreview(reader.result);
      setSvg(file);
    };
  };

  const { loading, message, error } = useSelector((state) => state.skill);
  const dispatch = useDispatch();
  const handleAddNewSkill = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("proficiency", proficiency);
    formData.append("svg", svg);
    dispatch(addNewSkill(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllSkillErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetSkillSlice());
      dispatch(getAllSkills());
    }
  }, [dispatch, loading, error]);

  return (
    <div className="relative flex justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 px-5">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <form className="w-[100%] md:w-[650px]" onSubmit={handleAddNewSkill}>
        <GlassCard>
          <CardContent className="p-6 sm:p-10">
            <h2 className="font-semibold leading-7 text-3xl text-center mb-8">
              ADD A NEW SKILL
            </h2>
            <RevealGroup as="div" className="flex flex-col gap-5" stagger={0.08}>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Title</Label>
                <Input
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="React.JS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Proficiency</Label>
                <Input
                  type="number"
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="30"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                />
              </RevealItem>

              <RevealItem className="w-full col-span-full">
                <Label>Skill Svg</Label>
                <div className="glass mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                  <div className="text-center">
                    {svgPreview ? (
                      <img
                        className="mx-auto h-12 w-12"
                        src={svgPreview}
                        alt="skill svg preview"
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
              {!loading ? (
                <Button type="submit" className="w-full hover:shadow-glow">
                  Add Skill
                </Button>
              ) : (
                <SpecialLoadingButton content={"Adding New Skill"} />
              )}
            </div>
          </CardContent>
        </GlassCard>
      </form>
    </div>
  );
};

export default AddSkill;
