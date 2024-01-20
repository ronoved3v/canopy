import mongoose from "mongoose";

const { Schema } = mongoose;

const ItemSchema = new Schema(
	{
		account: {
			type: Schema.Types.ObjectId,
			ref: "Account",
			required: true,
		},
		amount: String,
		sold_at: Date,
		license: String,
		support_amount: String,
		supported_until: Date,
		item: {
			id: Number,
			name: String,
			number_of_sales: Number,
			author_username: String,
			author_url: String,
			url: String,
			updated_at: Date,
			rating: Number,
			previews: Object,
		},
		code: String,
	},
	{ timestamps: true, collection: "Item" },
);

const Item = mongoose.model("Item", ItemSchema);

export default Item;
