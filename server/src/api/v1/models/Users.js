import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema(
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
	},
	{ timestamps: true, collection: "Users" },
);

usersSchema.index({ username: 1, email: 1 });

const Users = mongoose.model("Users", usersSchema);

export default Users;
