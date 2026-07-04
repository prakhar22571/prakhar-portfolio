import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import api from "../../lib/api";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, m } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Loader2 } from "lucide-react";

const Contact = () => {
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .post(
        "/api/v1/message/send",
        { senderName, subject, message },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setSenderName("");
        setSubject("");
        setMessage("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || error.message);
        setLoading(false);
      });
  };
  return (
    <div className="overflow-x-hidden">
      <div className="relative mb-8">
        <h1
          className="flex gap-4 items-center text-[1.85rem] sm:text-[2.75rem] md:text-[3rem]
            lg:text-[3rem] leading-[56px] md:leading-[67px] lg:leading-[90px]
            tracking-[15px] mx-auto w-fit font-extrabold about-h1 bg-background"
        >
          CONTACT
          <span className="text-tubeLight-effect font-extrabold mr-[-15px]">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-border"></span>
      </div>
      <Reveal as="div">
        <GlassCard>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleMessage} className="flex flex-col gap-6">
              <RevealGroup as="div" className="flex flex-col gap-6" stagger={0.1}>
                <RevealItem className="flex flex-col gap-2 px-1.5">
                  <Label className="text-xl">Your Name</Label>
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your Name"
                    className="focus-visible:shadow-glow-sm"
                  />
                </RevealItem>
                <RevealItem className="flex flex-col gap-2 px-1.5">
                  <Label className="text-xl">Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="focus-visible:shadow-glow-sm"
                  />
                </RevealItem>
                <RevealItem className="flex flex-col gap-2 px-1.5">
                  <Label className="text-xl">Message</Label>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    className="focus-visible:shadow-glow-sm"
                  />
                </RevealItem>
              </RevealGroup>
              <div className="flex justify-end">
                <AnimatePresence mode="wait" initial={false}>
                  {!loading ? (
                    <m.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full sm:w-52"
                    >
                      <Button type="submit" className="w-full hover:shadow-glow">
                        SEND MESSAGE
                      </Button>
                    </m.div>
                  ) : (
                    <m.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full sm:w-52"
                    >
                      <Button disabled className="w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </Button>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </CardContent>
        </GlassCard>
      </Reveal>
    </div>
  );
};

export default Contact;
