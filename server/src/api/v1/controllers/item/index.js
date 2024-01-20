import axios from "axios";
import logger from "../../../../utils/logger/logger.js";

import Account from "../../models/Account.js";
import User from "../../models/User.js";
import Item from "../../models/Item.js";

export const itemScan = async (req, res) => {
	try {
		const accounts = await Account.find();
		let itemIsUpdated = [];
		let itemHasNoUpdates = [];
		let newAddedItem = [];
		for (let account of accounts) {
			let config = {
				method: "get",
				url: "https://api.envato.com/v3/market/buyer/list-purchases",
				headers: {
					Authorization: `Bearer ${account.access_token}`,
				},
			};

			try {
				const response = await axios.request(config);
				if (response && response.data && response.data.results) {
					for (let result of response.data.results) {
						const existingItem = await Item.findOne({ code: result.code });
						if (existingItem) {
							const currentUpdatedAt = existingItem.item.updated_at.getTime(); // Chuyển đổi thành timestamp
							const scanUpdatedAt = new Date(result.item.updated_at).getTime(); // Chuyển đổi thành timestamp
							if (currentUpdatedAt !== scanUpdatedAt) {
								await Item.updateOne(
									{ code: result.code },
									{
										$set: {
											account: account._id,
											amount: result.amount,
											sold_at: result.sold_at,
											license: result.license,
											support_amount: result.support_amount,
											supported_until: result.supported_until,
											item: result.item,
										},
									},
								);
								itemIsUpdated.push(result.item.name);
							} else {
								itemHasNoUpdates.push(result.item.name);
							}
						} else {
							const newItem = await Item.create({
								account: account._id,
								amount: result.amount,
								sold_at: result.sold_at,
								license: result.license,
								support_amount: result.support_amount,
								supported_until: result.supported_until,
								item: result.item,
								code: result.code,
							});
							await Account.updateOne(
								{ _id: account._id },
								{ $push: { items: newItem._id } },
							);
							newAddedItem.push(newItem.item.name);
						}
					}
				}
			} catch (error) {
				console.error(`Error on account ${account._id}: ${error}`);
			}
		}

		return res.status(200).json({
			code: 200,
			message: "Scanned item successfully",
			data: { itemIsUpdated, itemHasNoUpdates: itemHasNoUpdates, newAddedItem },
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ code: 500, message: "Internal server error", error: error });
	}
};

export const itemList = async (req, res) => {
	try {
		const items = await Item.find().populate({
			path: "account",
			select: "-access_token -items",
		});
		const count = await Item.countDocuments();
		if (items)
			return res.status(200).json({ code: 200, total: count, data: items });
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({ code: 500, message: "Internal server error", error: error });
	}
};

export const getItemDownloadURL = async (req, res) => {
	try {
		const { itemId } = req.params;
		const item = await Item.findById(itemId).populate("account");

		if (!item) return res.status(404).json({ message: "Item not found" });

		let config = {
			method: "get",
			url: `https://api.envato.com/v3/market/buyer/download?purchase_code=${item.code}&shorten_url=true`,
			headers: {
				Authorization: `Bearer ${item.account.access_token}`,
			},
		};

		try {
			const response = await axios.request(config);
			if (response && response.data) {
				return res
					.status(200)
					.json({ code: 200, message: "Successful", data: response.data });
			}
		} catch (error) {
			console.log();
			logger.error(error.response.data.description);
			return res.status(500).json({
				code: 500,
				message: error.response.data.description,
				error: error,
			});
		}
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({ code: 500, message: "Internal server error", error: error });
	}
};
