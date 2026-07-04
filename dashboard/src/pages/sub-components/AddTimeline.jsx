import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import {
  addNewTimeline,
  clearAllTimelineErrors,
  getAllTimeline,
  resetTimelineSlice,
} from "@/store/slices/timelineSlice";
import { RevealGroup, RevealItem } from "@/components/reveal";

const AddTimeline = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { loading, error, message } = useSelector((state) => state.timeline);

  const handleAddNewTimeline = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("from", from);
    formData.append("to", to);
    dispatch(addNewTimeline(formData));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllTimelineErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetTimelineSlice());
      dispatch(getAllTimeline());
    }
  }, [dispatch, error, message, loading]);

  return (
    <div className="relative flex justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 px-5">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <form className="w-[100%] md:w-[650px]" onSubmit={handleAddNewTimeline}>
        <GlassCard>
          <CardContent className="p-6 sm:p-10">
            <h2 className="font-semibold leading-7 text-3xl text-center mb-8">
              ADD A NEW TIMELINE
            </h2>
            <RevealGroup as="div" className="flex flex-col gap-5" stagger={0.08}>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Title</Label>
                <Input
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="Matriculation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Description</Label>
                <Textarea
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Starting Point (From)</Label>
                <Input
                  type="number"
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </RevealItem>
              <RevealItem className="w-full sm:col-span-4">
                <Label>Ending Point (To)</Label>
                <Input
                  type="number"
                  className="mt-2 focus-visible:shadow-glow-sm"
                  placeholder="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </RevealItem>
            </RevealGroup>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              {!loading ? (
                <Button type="submit" className="w-full hover:shadow-glow">
                  Add Timeline
                </Button>
              ) : (
                <SpecialLoadingButton content={"Adding New Timeline"} />
              )}
            </div>
          </CardContent>
        </GlassCard>
      </form>
    </div>
  );
};

export default AddTimeline;
