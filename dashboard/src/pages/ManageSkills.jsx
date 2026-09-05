import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@portfolio/shared/components/ui/button";
import {
  GlassCard,
  CardHeader,
  CardTitle,
} from "@portfolio/shared/components/ui/glass-card";
import { SkillEditor } from "@/components/skill-editor";
import { deleteSkill, updateSkill } from "@/store/slices/skillSlice";
import { useMutation } from "@/hooks/use-mutation";
export default function ManageSkills() {
  const { skills } = useSelector((state) => state.skill);
  const mutate = useMutation();
  return (
    <div className="max-w-5xl mx-auto p-5">
      <GlassCard>
        <CardHeader className="flex-row justify-between">
          <CardTitle>Manage your skills</CardTitle>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </CardHeader>
        <div className="grid sm:grid-cols-2 gap-4 p-6">
          {skills.map((skill) => (
            <SkillEditor
              key={skill._id}
              skill={skill}
              onSave={(value) =>
                mutate(updateSkill(skill._id, value), "Skill updated.")
              }
              onDelete={() => mutate(deleteSkill(skill._id), "Skill deleted.")}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
