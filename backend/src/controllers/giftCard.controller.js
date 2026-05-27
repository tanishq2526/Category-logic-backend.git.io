const GiftCardService = require("../services/giftCard.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class GiftCardController {
  static create = catchAsync(async (req, res) => {
    const giftCard = await GiftCardService.createGiftCard(req.body);
    return ApiResponse.success(res, "Gift card created successfully", giftCard, 201);
  });

  static getAll = catchAsync(async (req, res) => {
    const result = await GiftCardService.getAllGiftCards(req.query);
    return ApiResponse.success(
      res,
      "Gift cards fetched successfully",
      result.giftCards,
      200
    );
  });

  static getSingle = catchAsync(async (req, res) => {
    const giftCard = await GiftCardService.getGiftCardById(req.params.id);
    return ApiResponse.success(res, "Gift card fetched successfully", giftCard, 200);
  });

  static update = catchAsync(async (req, res) => {
    const giftCard = await GiftCardService.updateGiftCard(req.params.id, req.body);
    return ApiResponse.success(res, "Gift card updated successfully", giftCard, 200);
  });

  static delete = catchAsync(async (req, res) => {
    await GiftCardService.deleteGiftCard(req.params.id);
    return ApiResponse.success(res, "Gift card deleted successfully", {}, 200);
  });
}

module.exports = GiftCardController;
