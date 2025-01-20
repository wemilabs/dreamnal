declare type Dream = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

declare type Tag = {
  name: string;
  value: string;
};
