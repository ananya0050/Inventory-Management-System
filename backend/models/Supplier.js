const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type:     String,
      required: [true, 'Supplier name is required'],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      trim:      true,
      lowercase: true,
    },

    phoneNumber: {
      type:     String,
      required: [true, 'Phone number is required'],
      trim:     true,
    },

    address: {
      type:     String,
      required: [true, 'Address is required'],
      trim:     true,
    },

    totalOrders: {
      type:    Number,
      default: 0,
      min:     0,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model('Supplier', supplierSchema);