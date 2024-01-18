import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
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
			required: true,
		},
		role: {
			type: String,
			default: "USER",
		},
	},
	{ timestamps: true, collection: "Users" },
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
