import mongoose, { Schema, Model } from "mongoose";

export interface ICommentDocument extends mongoose.Document {
  text: string;
  author: {
    id: mongoose.Types.ObjectId;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    text: String,
    author: {
      id: { type: Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ "author.id": 1 });

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model<ICommentDocument>("Comment", CommentSchema);

export default Comment;
