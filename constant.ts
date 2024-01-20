/** @format */
export const MAX_FREE_API = 5;
export type ChatMessage = {
  role: string;
  content: string | string[];
};
export type ContentChatMessage = {
  conversation: string;
  imageSrcs: string[];
  videoSrc: string;
  musicSrc: string;
  code: string;
};
