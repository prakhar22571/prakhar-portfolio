import { Badge } from "@/components/ui/badge";
import { Button } from "@portfolio/shared/components/ui/button";
import {
  GlassCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@portfolio/shared/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { deleteSoftwareApplication } from "@/store/slices/softwareApplicationSlice";
import { RevealGroup, RevealItem } from "@portfolio/shared/components/reveal";
import { useMutation } from "@/hooks/use-mutation";
const Dashboard = () => {
  const navigateTo = useNavigate();
  const gotoMangeSkills = () => navigateTo("/manage/skills");
  const gotoMangeTimeline = () => navigateTo("/manage/timeline");
  const gotoMangeProjects = () => navigateTo("/manage/projects");
  const { user } = useSelector((state) => state.user);
  const { skills } = useSelector((state) => state.skill);
  const { projects } = useSelector((state) => state.project);
  const { timeline } = useSelector((state) => state.timeline);
  const { softwareApplications, loading: appLoading } = useSelector(
    (state) => state.softwareApplications,
  );
  const [appId, setAppId] = useState(null);
  const mutate = useMutation();
  const handleDeleteSoftwareApp = async (id) => {
    setAppId(id);
    await mutate(deleteSoftwareApplication(id), "Application deleted.");
    setAppId(null);
  };
  return (
    <div className="relative flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <RevealGroup
            as="div"
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            stagger={0.08}
          >
            <RevealItem className="sm:col-span-2">
              <GlassCard className="h-full">
                <CardHeader className="pb-3">
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    {user.aboutMe}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild disabled={!user.portfolioURL}>
                    <a
                      href={user.portfolioURL || undefined}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit Portfolio
                    </a>
                  </Button>
                </CardFooter>
              </GlassCard>
            </RevealItem>
            <RevealItem>
              <GlassCard className="flex h-full flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle>Projects Completed</CardTitle>
                  <CardTitle className="text-6xl">
                    {projects && projects.length}
                  </CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={gotoMangeProjects}
                    className="hover:shadow-glow"
                  >
                    Manage Projects
                  </Button>
                </CardFooter>
              </GlassCard>
            </RevealItem>
            <RevealItem>
              <GlassCard className="flex h-full flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle>Skills</CardTitle>
                  <CardTitle className="text-6xl">
                    {skills && skills.length}
                  </CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={gotoMangeSkills}
                    className="hover:shadow-glow"
                  >
                    Manage Skill
                  </Button>
                </CardFooter>
              </GlassCard>
            </RevealItem>
          </RevealGroup>
          <section>
            <div>
              <GlassCard>
                <CardHeader className="px-7">
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Stack
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Deployed
                        </TableHead>
                        <TableHead className="md:table-cell">Update</TableHead>
                        <TableHead className="text-right">Visit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <RevealGroup
                      as="tbody"
                      className="[&_tr:last-child]:border-0"
                      stagger={0.05}
                    >
                      {projects && projects.length > 0 ? (
                        projects.map((element) => {
                          return (
                            <RevealItem
                              as="tr"
                              className="border-b bg-accent/60 transition-colors hover:bg-accent data-[state=selected]:bg-muted"
                              key={element._id}
                            >
                              <TableCell>
                                <div className="font-medium">
                                  {element.title}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {element.stack}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge className="text-xs" variant="secondary">
                                  {element.deployed}
                                </Badge>
                              </TableCell>
                              <TableCell className="md:table-cell">
                                <Link to={`/update/project/${element._id}`}>
                                  <Button>Update</Button>
                                </Link>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link to={element.projectLink} target="_blank">
                                  <Button>Visit</Button>
                                </Link>
                              </TableCell>
                            </RevealItem>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell className="text-3xl overflow-y-hidden">
                            You have not added any project.
                          </TableCell>
                        </TableRow>
                      )}
                    </RevealGroup>
                  </Table>
                </CardContent>
              </GlassCard>
            </div>
          </section>
          <section>
            <div>
              <GlassCard>
                <CardHeader className="px-7 gap-3">
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <RevealGroup
                  as="div"
                  className="grid sm:grid-cols-2 gap-4 p-6 pt-0"
                  stagger={0.06}
                >
                  {skills && skills.length > 0 ? (
                    skills.map((element) => {
                      return (
                        <RevealItem key={element._id}>
                          <GlassCard>
                            <CardHeader>{element.title}</CardHeader>
                            <CardFooter>
                              <Progress value={element.proficiency} />
                            </CardFooter>
                          </GlassCard>
                        </RevealItem>
                      );
                    })
                  ) : (
                    <p className="text-3xl">You have not added any skill.</p>
                  )}
                </RevealGroup>
              </GlassCard>
            </div>
          </section>
          <section>
            <div className="grid min-[1050px]:grid-cols-2 gap-4">
              <GlassCard>
                <CardHeader className="px-7">
                  <CardTitle>Software Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="md:table-cell">Icon</TableHead>
                        <TableHead className="md:table-cell text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <RevealGroup
                      as="tbody"
                      className="[&_tr:last-child]:border-0"
                      stagger={0.05}
                    >
                      {softwareApplications &&
                      softwareApplications.length > 0 ? (
                        softwareApplications.map((element) => {
                          return (
                            <RevealItem
                              as="tr"
                              className="border-b bg-accent/60 transition-colors hover:bg-accent data-[state=selected]:bg-muted"
                              key={element._id}
                            >
                              <TableCell className="font-medium">
                                {element.name}
                              </TableCell>
                              <TableCell className="md:table-cell">
                                <img
                                  className="w-7 h-7"
                                  src={element.svg && element.svg.url}
                                  alt={element.name}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </TableCell>
                              <TableCell className="md:table-cell  text-center">
                                {appLoading && appId === element._id ? (
                                  <SpecialLoadingButton
                                    content={"Deleting"}
                                    width={"w-fit"}
                                  />
                                ) : (
                                  <Button
                                    onClick={() =>
                                      handleDeleteSoftwareApp(element._id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                )}
                              </TableCell>
                            </RevealItem>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell className="text-3xl overflow-y-hidden">
                            You have not added any skill.
                          </TableCell>
                        </TableRow>
                      )}
                    </RevealGroup>
                  </Table>
                </CardContent>
              </GlassCard>
              <GlassCard>
                <CardHeader className="px-7 flex items-center justify-between flex-row">
                  <CardTitle>Timeline</CardTitle>
                  <Button
                    onClick={gotoMangeTimeline}
                    className="w-fit hover:shadow-glow"
                  >
                    Manage Timeline
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="md:table-cell">From</TableHead>
                        <TableHead className="md:table-cell text-right">
                          To
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <RevealGroup
                      as="tbody"
                      className="[&_tr:last-child]:border-0"
                      stagger={0.05}
                    >
                      {timeline && timeline.length > 0 ? (
                        timeline.map((element) => {
                          return (
                            <RevealItem
                              as="tr"
                              className="border-b bg-accent/60 transition-colors hover:bg-accent data-[state=selected]:bg-muted"
                              key={element._id}
                            >
                              <TableCell className="font-medium">
                                {element.title}
                              </TableCell>
                              <TableCell className="md:table-cell">
                                {element.timeline.from}
                              </TableCell>
                              <TableCell className="md:table-cell  text-right">
                                {element.timeline.to}
                              </TableCell>
                            </RevealItem>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell className="text-3xl overflow-y-hidden">
                            You have not added any timeline.
                          </TableCell>
                        </TableRow>
                      )}
                    </RevealGroup>
                  </Table>
                </CardContent>
              </GlassCard>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
