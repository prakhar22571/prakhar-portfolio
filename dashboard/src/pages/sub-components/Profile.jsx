import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/reveal";
import { FileText } from "lucide-react";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <Reveal as="div" className="w-full h-full">
      <div>
        <div className="grid w-[100%] gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-balance text-muted-foreground">
              Full Profile Preview
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-start lg:justify-between lg:items-center flex-col lg:flex-row gap-5">
              <div className="grid gap-2 w-full sm:w-72">
                <Label>Profile Image</Label>
                <img
                  src={user && user.avatar && user.avatar.url}
                  alt="avatar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl shadow-glow-sm"
                />
              </div>
              <div className="grid gap-2 w-full sm:w-72">
                <Label>Resume</Label>
                <div className="w-full sm:w-72 min-h-32 sm:h-72 rounded-2xl shadow-glow-sm border flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <FileText className="w-10 h-10 shrink-0" />
                  <span className="text-sm">
                    {user && user.resume ? "Resume on file" : "No resume uploaded"}
                  </span>
                  {user && user.resume && user.resume.url && (
                    <Link
                      to={user.resume.url}
                      target="_blank"
                      className="text-sm underline"
                    >
                      View resume
                    </Link>
                  )}
                </div>
              </div>
            </div>
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input type="text" defaultValue={user.fullName} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input type="text" defaultValue={user.phone} disabled />
              </div>
              <div className="grid gap-2">
                <Label>About Me</Label>
                <Textarea defaultValue={user.aboutMe} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Portfolio URL</Label>
                <Input type="text" defaultValue={user.portfolioURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Github URL</Label>
                <Input type="text" defaultValue={user.githubURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>LinkedIn URL</Label>
                <Input type="text" defaultValue={user.linkedInURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Instagram URL</Label>
                <Input type="text" defaultValue={user.instagramURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Twitter(X) URL</Label>
                <Input type="text" defaultValue={user.twitterURL} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Facebook URL</Label>
                <Input type="text" defaultValue={user.facebookURL} disabled />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
  );
};

export default Profile;
