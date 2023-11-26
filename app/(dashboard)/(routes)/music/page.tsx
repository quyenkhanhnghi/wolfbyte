"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader, Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import * as zod from "zod";

import { useUIContext } from "@/context/UIContext";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { formSchema } from "./formSchema";
import { Heading } from "@/components/Heading";
import { Empty } from "@/components/Empty";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function MusicPage() {
  const { setModalOpen, promptSuggestion, setPromptSuggestion } =
    useUIContext();
  const router = useRouter();
  // const { userId } = useAuth();

  const [music, setMusic] = useState();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: promptSuggestion || "",
    },
  });

  // // Fetching data when the component mounts
  // useEffect(() => {
  //   const fetchContent = async () => {
  //     try {
  //       const response = await axios.get("/api/content");
  //       setMusic(response.data);
  //     } catch (error) {
  //       console.error("Error fetching music content", error);
  //     }
  //   };

  //   fetchContent();
  // }, [userId]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: zod.infer<typeof formSchema>) => {
    try {
      //   const userMessage = { role: "user", content: value.prompt };
      //   const newMessage = [...music, userMessage];
      setMusic(undefined);

      const response = await axios.post("/api/music", value);
      // const response = {
      //   data: {
      //     audio:
      //       "https://replicate.delivery/pbxt/SCiO1SBkqj7gL5cTsq8AXz5pIwPajeiWbb9s17KtyQ2G3OFIA/gen_sound.wav",
      //     spectrogram:
      //       "https://replicate.delivery/pbxt/Xkr2iGJhHkJ3K9j5B7Xa1sSbRQmPZ7d8R17WXsalRbnjbnCE/spectrogram.jpg",
      //   },
      // };

      // reset prompSuggetion
      setPromptSuggestion("");

      console.log(response);

      // save music
      setMusic(response.data.audio);
      // setMusic((currMessage) => [
      //   ...currMessage,
      //   userMessage,
      //   response.data.audio,
      // ]);

      // Save content to backend
      // await axios.post("/api/content", {
      //   contentType: "MUSIC",
      //   content: response.data.audio,
      // });

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

          {!music && !isLoading && <Empty label="No music generated." />}

          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
}
