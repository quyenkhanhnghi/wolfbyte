"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { BotAvatar } from "@/components/BotAvatar";
import { Empty } from "@/components/Empty";
import { Heading } from "@/components/Heading";
import { Loader } from "@/components/Loader";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatMessage } from "@/constant";
import { useUIContext } from "@/context/UIContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { amountOptions, formSchema, resolutionOptions } from "./formSchema";

export default function ImagePage() {
  const { setModalOpen, promptSuggestion, setPromptSuggestion } =
    useUIContext();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: promptSuggestion || "",
      amount: "Choose amount of images to be displayed",
      resolution: "Choose resolution",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    try {
      const userMessage = { role: "user", content: value.prompt };

      const response = await axios.post("/api/image", value);

      const urls = response.data.map((image: { url: string }) => image.url);
      const chatbotMessage = { role: "assistant", content: urls };

      setMessages((currMessage) => [
        ...currMessage,
        userMessage,
        chatbotMessage,
      ]);

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
        title="Image Generation"
        description="Image generation using text inputs"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A cat and dog fighting picture"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Choose a image"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button className="w-full bg-black text-white col-span-10 lg:col-span-2">
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
            <Empty label="No images generated." />
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
                {message.role === "user" ? (
                  <p className="text-sm mt-2">{message.content}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 m-2">
                    {Array.isArray(message.content) &&
                      message.content.map((image, index) => (
                        <Card
                          key={index}
                          className="rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image
                              alt="Generated AI"
                              src={image}
                              sizes="400"
                              width={500}
                              height={500}
                            />
                          </div>
                          <CardFooter className="p-2">
                            <Button
                              onClick={() => window.open(image)}
                              variant="secondary"
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
