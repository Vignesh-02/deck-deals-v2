import { Types } from "mongoose";
import { DeckType } from "@/lib/deck-types";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: "seller" | "customer";
  emailVerified: boolean;
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
  deckType?: DeckType;
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
