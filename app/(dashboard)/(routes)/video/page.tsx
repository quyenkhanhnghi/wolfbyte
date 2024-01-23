"use client";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Empty } from "@/components/Empty";
import { Heading } from "@/components/Heading";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUIContext } from "@/context/UIContext";
import { formSchema } from "./formSchema";
import { ChatMessage } from "@/constant";
import { BotAvatar } from "@/components/BotAvatar";
import { UserAvatar } from "@/components/UserAvatar";
import { cn, saveMessage } from "@/lib/utils";
import { useFetchData } from "@/hooks/FetchData";
import { contentType, generatedBy } from "@/type";

export default function VideoPage() {
  const { setModalOpen, promptSuggestion, setPromptSuggestion } =
    useUIContext();
  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: promptSuggestion || "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  // State to store messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Fetch old messages from database
  useFetchData(setMessages, contentType.video.toLowerCase());

  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    try {
      const userMessage = { role: "user", content: value.prompt };

      // Save user prompt before submitting message
      await saveMessage(contentType.video, generatedBy.user, value.prompt);

      const response = await axios.post("/api/video", value);

      const chatbotMessage = { role: "assistant", content: response.data[0] };

      setMessages((currMessage) => [
        ...currMessage,
        userMessage,
        chatbotMessage,
      ]);

      // Save chatbot response
      await saveMessage(
        contentType.video,
        generatedBy.assistant,
        response.data[0]
      );

      form.reset();
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 403) {
        setModalOpen();
      } else {
        toast.error("Something went wrong. Please try again");
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Video Generation"
        description="Video generation using text inputs"
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Cat knead and make biscuits..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button className="w-full bg-black text-white col-span-12 lg:col-span-2">
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-white">
              <Loader />
            </div>
          )}

          {!messages && !isLoading && <Empty label="No video generated." />}

          <div className="flex flex-col-reverse gap-y-4 overflow-hidden">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-muted border border-black/10"
                    : "bg-white  border"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {message.role === "user" ? (
                  <p className="text-sm mt-2">{message.content}</p>
                ) : (
                  <video className="w-full aspect-video" controls>
                    {" "}
                    <source src={message.content as string} />
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
