import { Button } from "@/components/ui/button";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/glass-card";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  clearAllProjectErrors,
  deleteProject,
  getAllProjects,
  resetProjectSlice,
} from "@/store/slices/projectSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Eye, Pen, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RevealGroup, RevealItem } from "@/components/reveal";

const ManageProjects = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };
  const { projects, loading, error, message } = useSelector(
    (state) => state.project
  );

  const dispatch = useDispatch();
  const handleProjectDelete = (id) => {
    dispatch(deleteProject(id));
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
                <CardTitle>Manage Your Projects</CardTitle>
                <Button className="w-fit hover:shadow-glow" onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Stack
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Deployed
                      </TableHead>
                      <TableHead className="md:table-cell">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <RevealGroup as="tbody" className="[&_tr:last-child]:border-0" stagger={0.05}>
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
                                <img
                                  src={
                                    element.projectBanner &&
                                    element.projectBanner.url
                                  }
                                  alt={element.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-16 h-16 rounded-md"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{element.title}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {element.stack}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {element.deployed}
                            </TableCell>
                            <TableCell className="flex flex-row items-center gap-3 h-24">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={`/view/project/${element._id}`}>
                                      <button
                                        className="border-green-600 border-2 rounded-full h-8 w-8 flex
                                      justify-center items-center text-green-600  hover:text-slate-950
                                      hover:bg-green-600"
                                      >
                                        <Eye className="h-5 w-5" />
                                      </button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    View
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={`/update/project/${element._id}`}>
                                      <button className="border-yellow-400 border-2 rounded-full h-8 w-8 flex justify-center items-center text-yellow-400  hover:text-slate-950 hover:bg-yellow-400">
                                        <Pen className="h-5 w-5" />
                                      </button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    Edit
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="border-red-600 border-2 rounded-full h-8 w-8 flex justify-center items-center text-red-600  hover:text-slate-50 hover:bg-red-600"
                                      onClick={() =>
                                        handleProjectDelete(element._id)
                                      }
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    Delete
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </RevealItem>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell className="text-2xl">
                          You have not added any project.
                        </TableCell>
                      </TableRow>
                    )}
                  </RevealGroup>
                </Table>
              </CardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageProjects;
