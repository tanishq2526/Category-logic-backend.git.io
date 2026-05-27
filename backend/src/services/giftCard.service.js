const GiftCard = require("../models/GiftCard");
const ApiError = require("../utils/ApiError");

class GiftCardService {
  static async createGiftCard(data) {
    const { receiverName, senderName, code, giftCardValue, expiryDate, description, status } = data;

    if (!receiverName || !senderName || !code || !giftCardValue || !expiryDate) {
      throw new ApiError(400, "All required fields must be filled");
    }

    if (new Date(expiryDate) < new Date()) {
      throw new ApiError(400, "Expiry date must be a future date");
    }

    const existingGiftCard = await GiftCard.findOne({
      code: code.toUpperCase(),
    });

    if (existingGiftCard) {
      throw new ApiError(400, "Gift card code already exists");
    }

    const newGiftCard = new GiftCard({
      receiverName,
      senderName,
      code: code.toUpperCase(),
      giftCardValue,
      expiryDate,
      description: description || "",
      status: status || "active",
    });

    await newGiftCard.save();
    return newGiftCard;
  }

  static async getAllGiftCards(filters) {
    const { search, status, page, limit } = filters;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 5;

    const query = {};

    if (search) {
      query.$or = [
        { receiverName: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const totalGiftCards = await GiftCard.countDocuments(query);

    const giftCards = await GiftCard.find(query)
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    return {
      giftCards,
      totalGiftCards,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalGiftCards / parsedLimit),
    };
  }

  static async getGiftCardById(id) {
    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      throw new ApiError(404, "Gift card not found");
    }
    return giftCard;
  }

  static async updateGiftCard(id, data) {
    const { receiverName, senderName, code, giftCardValue, expiryDate, description, status } = data;

    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      throw new ApiError(404, "Gift card not found");
    }

    if (code && code.toUpperCase() !== giftCard.code) {
      const existingGiftCard = await GiftCard.findOne({
        code: code.toUpperCase(),
      });
      if (existingGiftCard) {
        throw new ApiError(400, "Gift card code already exists");
      }
      giftCard.code = code.toUpperCase();
    }

    if (expiryDate) {
      if (new Date(expiryDate) < new Date()) {
        throw new ApiError(400, "Expiry date must be a future date");
      }
      giftCard.expiryDate = expiryDate;
    }

    if (receiverName !== undefined) giftCard.receiverName = receiverName;
    if (senderName !== undefined) giftCard.senderName = senderName;
    if (giftCardValue !== undefined) giftCard.giftCardValue = giftCardValue;
    if (description !== undefined) giftCard.description = description;
    if (status !== undefined) giftCard.status = status;

    await giftCard.save();
    return giftCard;
  }

  static async deleteGiftCard(id) {
    const giftCard = await GiftCard.findByIdAndDelete(id);
    if (!giftCard) {
      throw new ApiError(404, "Gift card not found");
    }
    return giftCard;
  }
}

module.exports = GiftCardService;
