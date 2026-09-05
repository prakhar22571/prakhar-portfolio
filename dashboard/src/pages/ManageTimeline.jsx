import { useMutation } from "@/hooks/use-mutation";
import { useNavigate } from "react-router-dom";
import { Button } from "@portfolio/shared/components/ui/button";
import {
  GlassCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@portfolio/shared/components/ui/glass-card";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { deleteTimeline } from "@/store/slices/timelineSlice";
import { RevealGroup, RevealItem } from "@portfolio/shared/components/reveal";

const ManageTimeline = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };
  const { loading, timeline } = useSelector((state) => state.timeline);
  const mutate = useMutation();

  const handleDeleteTimeline = (id) => {
    mutate(deleteTimeline(id), "Timeline deleted.");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      <div className="p-4 sm:px-6 sm:py-4">
        <section>
          <div>
            <GlassCard>
              <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
                <CardTitle>Manage Your Timeline</CardTitle>
                <Button
                  className="w-fit hover:shadow-glow"
                  onClick={handleReturnToDashboard}
                >
                  Return to Dashboard
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="md:table-cell">From</TableHead>
                      <TableHead className="md:table-cell">To</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <RevealGroup
                    as="tbody"
                    className="[&_tr:last-child]:border-0"
                    stagger={0.05}
                  >
                    {timeline.length > 0 ? (
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
                              {element.description}
                            </TableCell>
                            <TableCell className="md:table-cell">
                              {element.timeline.from}
                            </TableCell>
                            <TableCell className="md:table-cell">
                              {element.timeline.to
                                ? element.timeline.to
                                : "____"}
                            </TableCell>
                            <TableCell className="flex justify-end">
                              <button
                                disabled={loading}
                                className="border-red-600 border-2 rounded-full h-8 w-8 flex
                              justify-center items-center text-red-600  hover:text-slate-50 hover:bg-red-600"
                                onClick={() =>
                                  handleDeleteTimeline(element._id)
                                }
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </TableCell>
                          </RevealItem>
                        );
                      })
                    ) : (
                      <TableRow className="text-2xl">
                        <TableCell>You have not added any timeline.</TableCell>
                      </TableRow>
                    )}
                  </RevealGroup>
                </Table>
              </CardContent>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageTimeline;
