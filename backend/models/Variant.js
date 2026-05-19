// const mongoose = require("mongoose");

// const VariantSchema = new mongoose.Schema(
//   {
//     parentProduct: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Products",
//     },
//     image: {
//       type: String,
//       default: null,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     brand: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     discountPrice: {
//       type: Number,
//     },
//     discountPercent: {
//       type: Number,
//     },
//     status: {
//       type: String,
//       enum: ["Active", "Inactive"],
//       default: "Active",
//       required: true,
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Variants", VariantSchema);

const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema(
  {
    parentProduct: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Products",
    },

    image: {
      type: String,
      default: null,
    },

    image1: {
      type: String,
      default: null,
    },

    image2: {
      type: String,
      default: null,
    },

    image3: {
      type: String,
      default: null,
    },

    image4: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    discountPercent: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Variants", VariantSchema);
