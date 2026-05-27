const calculateDiscountPrice = (price, discountPercent) => {
  const numPrice = Number(price);
  const numPercent = Number(discountPercent);

  if (isNaN(numPrice) || numPrice < 0) {
    return 0;
  }

  if (isNaN(numPercent) || numPercent <= 0) {
    return numPrice;
  }

  // Calculate price after percentage discount
  const discountAmount = (numPrice * numPercent) / 100;
  return Number((numPrice - discountAmount).toFixed(2));
};

module.exports = {
  calculateDiscountPrice,
};
