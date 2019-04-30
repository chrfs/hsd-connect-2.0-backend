import mongoose from "mongoose";
import { schemaUtils } from "../../utils/models/schemaUtils";

const notificationSchema = new mongoose.Schema({
  origin: {
    type: mongoose.Schema.Types.String
  },
  originId: {
    type: mongoose.Schema.Types.ObjectId
  },
  isActive: {
    type: mongoose.Schema.Types.Boolean,
    default: true
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
});

notificationSchema.pre("save", schemaUtils.setPropertyDate("updatedAt"));

export default notificationSchema;
