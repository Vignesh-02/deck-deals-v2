import mongoose, { Schema, Model } from "mongoose";

export interface IDeckDocument extends mongoose.Document {
  name: string;
  mobile: string;
  email: string;
  address: string;
  price: string;
  images: string[];
  image?: string; // legacy single-image field
  description: string;
  author: {
    id: mongoose.Types.ObjectId;
    username: string;
  };
  stock: string;
  comments: mongoose.Types.ObjectId[];
}

const DeckSchema = new Schema<IDeckDocument>({
  name: String,
  mobile: String,
  email: String,
  address: String,
  price: String,
  images: [String],
  image: String, // legacy single-image field
  description: String,
  author: {
    id: { type: Schema.Types.ObjectId, ref: "User" },
    username: String,
  },
  stock: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

DeckSchema.index({ "author.id": 1 });
DeckSchema.index({ name: 1 });

// Use the same collection name "decks" as the original app.
// In dev hot-reload, an old cached model can miss `images` and silently strip it.
const cachedDeckModel = mongoose.models.decks as Model<IDeckDocument> | undefined;
if (cachedDeckModel && !cachedDeckModel.schema.path("images")) {
  delete mongoose.models.decks;
}

const Deck: Model<IDeckDocument> =
  (mongoose.models.decks as Model<IDeckDocument>) ||
  mongoose.model<IDeckDocument>("decks", DeckSchema);

export default Deck;
