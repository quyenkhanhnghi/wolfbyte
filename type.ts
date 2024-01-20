export interface GeneratedContent {
  id: string;
  userId: string;
  contentType: string; // Assuming contentType is a string. Replace with the correct type if it's an enum or something else.
  isUserGenerated: "user" | "assistant"; // Replace with your enum if you have defined it differently.
  createdAt: Date; // or string, if you are receiving it as a string
  content: string;
  // user: UserType; // Include this if you need user details in your frontend and they are included in the response
}

export const contentType = {
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
