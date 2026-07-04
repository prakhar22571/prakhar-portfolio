import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GlassCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/glass-card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  clearAllSkillErrors,
  updateSkill,
  resetSkillSlice,
  deleteSkill,
  getAllSkills,
} from "@/store/slices/skillSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/reveal";

const ManageSkills = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };
  const { loading, skills, error, message } = useSelector(
    (state) => state.skill
  );
  const dispatch = useDispatch();

  const [newProficiency, setNewProficiency] = useState(1);
  const handleInputChange = (proficiency) => {
    setNewProficiency(proficiency);
  };

  const handleUpdateSkill = (id) => {
    dispatch(updateSkill(id, newProficiency));
  };

  const handleDeleteSkill = (id) => {
    dispatch(deleteSkill(id));
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
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <div className="p-4 sm:px-6 sm:py-4">
        <Tabs defaultValue="week">
          <TabsContent value="week">
            <GlassCard>
              <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
                <CardTitle>Manage Your Skills</CardTitle>
                <Button className="w-fit hover:shadow-glow" onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </CardHeader>
              <RevealGroup as="div" className="grid sm:grid-cols-2 gap-4 p-6 pt-0" stagger={0.06}>
                {skills.map((element) => {
                  return (
                    <RevealItem key={element._id} whileHover={{ y: -2 }}>
                      <GlassCard>
                        <CardHeader className="text-3xl font-bold flex items-center justify-between flex-row">
                          {element.title}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Trash2
                                  onClick={() => handleDeleteSkill(element._id)}
                                  className="h-5 w-5 hover:text-red-500"
                                />
                              </TooltipTrigger>
                              <TooltipContent side="right" style={{ color: "red" }}>
                                Delete
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardHeader>
                        <CardFooter>
                          <Label className="text-2xl mr-2">Proficiency:</Label>
                          <Input
                            type="number"
                            defaultValue={element.proficiency}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onBlur={() => handleUpdateSkill(element._id)}
                            className="focus-visible:shadow-glow-sm"
                          />
                        </CardFooter>
                      </GlassCard>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageSkills;
