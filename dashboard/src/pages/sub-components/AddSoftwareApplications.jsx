import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewSoftwareApplication,
  clearAllSoftwareAppErrors,
  getAllSoftwareApplications,
  resetSoftwareApplicationSlice,
} from "@/store/slices/softwareApplicationSlice";
import { RevealGroup, RevealItem } from "@/components/reveal";

const AddSoftwareApplications = () => {
  const [name, setName] = useState("");
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

  const { loading, error, message } = useSelector(
    (state) => state.softwareApplications
  );

  const dispatch = useDispatch();
  const handleAddSoftwareApp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("svg", svg);
    dispatch(addNewSoftwareApplication(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllSoftwareAppErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetSoftwareApplicationSlice());
      dispatch(getAllSoftwareApplications());
      setName("");
      setSvg("");
      setSvgPreview("");
    }
  }, [dispatch, loading, error, message]);

  return (
    <div className="relative flex justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 px-5">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <form
        onSubmit={handleAddSoftwareApp}
        className="w-[100%] md:w-[650px]"
      >
        <GlassCard>
          <CardContent className="p-6 sm:p-10">
            <h2 className="font-semibold leading-7 text-3xl text-center mb-8">
              ADD SOFTWARE APPLICATION
            </h2>
            <RevealGroup as="div" className="flex flex-col gap-5" stagger={0.08}>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Application Name</Label>
                <Input
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="Android Studio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </RevealItem>

              <RevealItem className="w-full col-span-full">
                <Label htmlFor="cover-photo">Skill Svg</Label>
                <div className="glass mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                  <div className="text-center">
                    {svgPreview ? (
                      <img
                        className="mx-auto h-12 w-12"
                        src={svgPreview}
                        alt="app svg preview"
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
                  Add Software Application
                </Button>
              ) : (
                <SpecialLoadingButton content="Adding Application" />
              )}
            </div>
          </CardContent>
        </GlassCard>
      </form>
    </div>
  );
};

export default AddSoftwareApplications;
