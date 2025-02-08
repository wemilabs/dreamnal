declare type Dream = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isBookmarked?: boolean;
  mood?: "happy" | "neutral" | "scary" | "unknown";
  location?: string;
};

declare type Tag = {
  name: string;
  value: string;
};

declare type Category = {
  name: string;
  description: string;
  image?: string;
};
