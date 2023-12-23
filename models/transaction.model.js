const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionStatusEnum = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
};
const TransactionType = {
  BUY: "BUY",
  SELL: "SELL",
};
const transactionSchema = new Schema(
  {
    status: {
      type: String, // String from enum -> TransactionStatusEnum
    },
    type: {
      type: String, // String for type of transaction enum -> TransactionType
    },
    transactionDate: {
      type: Date,
    },
    transactionId: {
      type: Number,  
    },
    name: {
      type: String,
    },
    amount: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // userId of the user
    },
    hasContacted: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = {
  Transaction,
  transactionSchema,
  TransactionStatusEnum,
  TransactionType,
};
