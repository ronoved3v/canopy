import mongoose from "mongoose";

const { Schema } = mongoose;

const AccountSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		access_token: {
			type: String,
			required: true,
			unique: true,
		},
		items: [
			{
				type: Schema.Types.ObjectId,
				ref: "Item",
			},
		],
	},
	{ timestamps: true, collection: "Account" },
);

const Account = mongoose.model("Account", AccountSchema);

export default Account;
