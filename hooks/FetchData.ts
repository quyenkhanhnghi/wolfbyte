import { ChatMessage } from "@/constant";
import { ContentMessage, GeneratedContent } from "@/type";
import axios from "axios";
import { useEffect } from "react";

type SetMessagesFunction = React.Dispatch<React.SetStateAction<ChatMessage[]>>;

// hook to fetch data messages from database
export const useFetchData = (
  setMessages: SetMessagesFunction,
  contentType: string
) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/content/${contentType}`);

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
      } catch (e) {
        console.log("Error fetching data from database", e);
      }
    };

    fetchData();
  }, [setMessages]);
};
