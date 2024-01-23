export interface GeneratedContent {
  id: string;
  userId: string;
  contentType: string;
  isUserGenerated: "user" | "assistant";
  createdAt: Date;
  content: string;
  // Content: ContentMessage[];
  // user: UserType;
}

export interface ContentMessage {
  id: string;
  generatedContentId: string;
  content: string;
}

// Define contentType object with explicit type annotations
export const contentType: { [key: string]: string } = {
  conversation: "CONVERSATION",
  music: "MUSIC",
  video: "VIDEO",
  image: "IMAGE",
  code: "CODE",
};

export const generatedBy = {
  user: "user",
  assistant: "assistant",
};
