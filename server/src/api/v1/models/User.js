import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
			maxlength: [128, "Password must be at most 128 characters long"],
		},
		role: {
			type: String,
			enum: ["USER", "ADMIN", "MODERATOR"],
			default: "USER",
		},
		accounts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Account",
			},
		],
	},
	{ timestamps: true, collection: "User" },
);

const User = mongoose.model("User", UserSchema);

export default User;
