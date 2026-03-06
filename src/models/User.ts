import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUserDocument extends mongoose.Document {
  username: string;
  passwordHash?: string;
  hash?: string;
  salt?: string;
}

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  passwordHash: String,
  // Legacy fields from passport-local-mongoose (pbkdf2)
  hash: String,
  salt: String,
});

// Verify password — handles both legacy pbkdf2 and new bcrypt hashes
UserSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
  // New bcrypt hash
  if (this.passwordHash) {
    return bcrypt.compare(password, this.passwordHash);
  }
  // Legacy passport-local-mongoose (pbkdf2)
  if (this.hash && this.salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.salt, 25000, 512, "sha256", (err, derivedKey) => {
        if (err) return reject(err);
        resolve(derivedKey.toString("hex") === this.hash);
      });
    });
  }
  return false;
};

// Migrate legacy hash to bcrypt on successful login
UserSchema.methods.migratePassword = async function (password: string): Promise<void> {
  if (!this.passwordHash && this.hash && this.salt) {
    this.passwordHash = await bcrypt.hash(password, 12);
    this.hash = undefined;
    this.salt = undefined;
    await this.save();
  }
};

// Static: register a new user
UserSchema.statics.registerUser = async function (username: string, password: string) {
  const existing = await this.findOne({ username });
  if (existing) {
    throw new Error("A user with the given username is already registered");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  return this.create({ username, passwordHash });
};

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
