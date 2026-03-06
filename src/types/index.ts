import { Types } from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  hash?: string;
  salt?: string;
  passwordHash?: string;
}

export interface IDeckAuthor {
  id: string;
  username: string;
}

export interface IDeck {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  price: string;
  images: string[];
  image?: string; // legacy single-image field
  description: string;
  author: IDeckAuthor;
  stock: string;
  comments: IComment[];
}

export interface IComment {
  _id: string;
  text: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}
