"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader, Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { BotAvatar } from "@/components/BotAvatar";
import { Empty } from "@/components/Empty";
import { Heading } from "@/components/Heading";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/constant";
import { useUIContext } from "@/context/UIContext";
import { cn, saveMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import { formSchema } from "./formSchema";
import { useFetchData } from "@/hooks/FetchData";
import { contentType, generatedBy } from "@/type";

export default function MusicPage() {
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
  useFetchData(setMessages, contentType.music.toLowerCase());

  // Function handle submit the input message
  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    try {
      const userMessage = { role: "user", content: value.prompt };

      // Save user prompt before submitting message
      await saveMessage(contentType.music, generatedBy.user, value.prompt);

      const response = await axios.post("/api/music", value);
      const chatbotMessage = {
        role: "assistant",
        content: response.data.audio,
      };

      setMessages((currMessage) => [
        ...currMessage,
        userMessage,
        chatbotMessage,
      ]);

      // Save chatbot response
      await saveMessage(
        contentType.music,
        generatedBy.assistant,
        response.data.audio
      );

      // Reset prompSuggetion and form
      setPromptSuggestion("");
      form.reset({ prompt: "" });
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

  console.log(messages);

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Music generation using text inputs"
        icon={Music}
        iconColor="text-emerald-700"
        bgColor="bg-emerald-700/10"
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
                        placeholder="Cat meowing..."
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

          {!messages && !isLoading && <Empty label="No music generated." />}

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
                  <audio controls className="w-full mt-8">
                    <source src={message.content as string} />
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
