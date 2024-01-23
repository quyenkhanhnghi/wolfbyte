"use client";
import axios from "axios";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import * as zod from "zod";

import { BotAvatar } from "@/components/BotAvatar";
import { Empty } from "@/components/Empty";
import { Heading } from "@/components/Heading";
import { Loader } from "@/components/Loader";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/constant";
import { useUIContext } from "@/context/UIContext";
import { useFetchData } from "@/hooks/FetchData";
import { cn, saveMessage } from "@/lib/utils";
import { contentType, generatedBy } from "@/type";
import { Code } from "lucide-react";
import { formSchema } from "./formSchema";

export default function CodePage() {
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
  useFetchData(setMessages, contentType.code.toLowerCase());

  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    console.log(value);
    try {
      const userMessage = { role: "user", content: value.prompt };
      const newMessage = [...messages, userMessage];

      // Save user prompt before submitting message
      await saveMessage(contentType.code, generatedBy.user, value.prompt);

      const response = await axios.post(
        "/api/code",
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
      await saveMessage(
        contentType.code,
        generatedBy.assistant,
        response.data.content
      );

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
  console.log(messages);
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Code generation using text inputs"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                        placeholder="How do I implement lazy loading for images in a React application ?"
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
          {messages.length === 0 && !isLoading && (
            <Empty label="No code generated." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
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
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {(message.content as string) || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
