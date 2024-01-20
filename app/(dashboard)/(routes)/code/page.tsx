"use client";
import toast from "react-hot-toast";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import { BotAvatar } from "@/components/BotAvatar";
import { Empty } from "@/components/Empty";
import { Heading } from "@/components/Heading";
import { Loader } from "@/components/Loader";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUIContext } from "@/context/UIContext";
import { formSchema } from "./formSchema";
import { Code } from "lucide-react";
import { ChatMessage } from "@/constant";

export default function CodePage() {
  const modal = useUIContext();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    console.log(value);
    try {
      const userMessage = { role: "user", content: value.prompt };
      const newMessage = [...messages, userMessage];
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

      form.reset();
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 403) {
        modal.setModalOpen();
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
            {messages.map((message) => (
              <div
                key={message.content}
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
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
