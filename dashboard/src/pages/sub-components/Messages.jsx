import { useMutation } from "@/hooks/use-mutation";
import { Button } from "@portfolio/shared/components/ui/button";
import {
  GlassCard,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@portfolio/shared/components/ui/glass-card";
import { deleteMessage } from "@/store/slices/messageSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { useNavigate } from "react-router-dom";
import { RevealGroup, RevealItem } from "@portfolio/shared/components/reveal";

const Messages = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  const { messages, loading } = useSelector((state) => state.messages);

  const [messageId, setMessageId] = useState("");
  const handleMessageDelete = (id) => {
    setMessageId(id);
    mutate(deleteMessage(id), "Message deleted.");
  };

  const mutate = useMutation();

  return (
    <div className="relative min-h-[100vh] sm:gap-4 sm:py-4 sm:pl-20 px-4">
      <GlassCard>
        <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
          <CardTitle>Messages</CardTitle>
          <Button
            className="w-fit hover:shadow-glow"
            onClick={handleReturnToDashboard}
          >
            Return to Dashboard
          </Button>
        </CardHeader>
        <RevealGroup
          as="div"
          className="grid sm:grid-cols-2 gap-4 p-6 pt-0"
          stagger={0.06}
        >
          {messages && messages.length > 0 ? (
            messages.map((element) => {
              return (
                <RevealItem key={element._id}>
                  <GlassCard className="grid gap-2 p-6">
                    <CardDescription>
                      <span className="font-bold mr-2">Sender Name:</span>
                      {element.senderName}
                    </CardDescription>
                    <CardDescription>
                      <span className="font-bold mr-2">Subject:</span>
                      {element.subject}
                    </CardDescription>
                    <CardDescription>
                      <span className="font-bold mr-2">Message:</span>
                      {element.message}
                    </CardDescription>
                    <CardFooter className="justify-end p-0 pt-2">
                      {loading && messageId === element._id ? (
                        <SpecialLoadingButton
                          content={"Deleting"}
                          width={"w-32"}
                        />
                      ) : (
                        <Button
                          className="w-32"
                          onClick={() => handleMessageDelete(element._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </CardFooter>
                  </GlassCard>
                </RevealItem>
              );
            })
          ) : (
            <CardHeader className="text-2xl">No Messages Found!</CardHeader>
          )}
        </RevealGroup>
      </GlassCard>
    </div>
  );
};

export default Messages;
