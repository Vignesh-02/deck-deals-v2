import { z } from "zod";
import { DECK_TYPES } from "@/lib/deck-types";

const imageUrlSchema = z.string().refine((value) => {
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith("/")) return true;
  return /^https?:\/\//i.test(url);
}, "Each image must be a valid URL.");

export const registerSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long.")
    .regex(/^[A-Za-z0-9]+$/, "Username can only contain letters and numbers."),
  email: z.string().email("Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character."
    ),
  role: z.enum(["seller", "customer"], { message: "Please choose a role." }),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export const deckSchema = z.object({
  name: z.string().min(1, "Deck name is required."),
  mobile: z.string().min(1, "Contact number is required."),
  email: z.string().email("Please enter a valid email."),
  deckType: z.enum(DECK_TYPES, { message: "Please select a deck type." }),
  address: z.string().min(1, "Address is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  images: z.array(imageUrlSchema).min(1, "At least one image is required."),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more."),
  description: z.string().optional().default(""),
});

export const commentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment text is required.")
    .max(2000, "Comment must be at most 2000 characters."),
});
