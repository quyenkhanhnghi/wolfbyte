/** @format */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "./formSchema";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loader";
import { UserAvatar } from "@/components/UserAvatar";
import { BotAvatar } from "@/components/BotAvatar";
import { cn } from "@/lib/utils";
import { useUIContext } from "@/context/UIContext";
import toast from "react-hot-toast";
import { GeneratedContent, contentType, generatedBy } from "@/type";
import { ChatMessage } from "@/constant";

export default function ConversationPage() {
  const { setModalOpen, promptSuggestion, setPromptSuggestion } =
    useUIContext();
  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: promptSuggestion || "",
    },
  });

  // State to store messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch old messages from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/content");

        if (!response) {
          return;
        }

        const newMessages = response.data.map((message: GeneratedContent) => {
          return {
            role: message.isUserGenerated,
            content: message.content,
          };
        });
        console.log(newMessages);
        setMessages(newMessages);
      } catch (e: unknown) {
        console.log("Error fetching data from database", e);
      }
    };

    fetchData();
  }, []);

  const saveMessage = async (message: string, isUserGenerated: string) => {
    await axios.post("/api/content", {
      contentType: contentType.conversation,
      isUserGenerated: isUserGenerated,
      content: message,
    });
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    try {
      const userMessage = { role: "user", content: value.prompt };
      const newMessage = [...messages, userMessage];

      // Save user prompt
      await saveMessage(value.prompt, generatedBy.user);

      const response = await axios.post(
        "/api/conversation",
        {
          messages: newMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((currMessage) => [
        ...currMessage,
        userMessage,
        response.data,
      ]);

      // Save chatbot response
      await saveMessage(response.data.content, generatedBy.assistant);

      // Reset prompSuggetion and form
      setPromptSuggestion("");
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
    <div className="relative h-full w-full flex-1 overflow-auto">
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="Are cats weird or are humans boring?"
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
        <div className="space-y-4 mt-4 justify-end">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-white">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
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
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
