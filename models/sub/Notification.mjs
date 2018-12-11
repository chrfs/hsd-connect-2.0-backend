import mongoose from 'mongoose'
import { schemaRecordUtils } from '../../utils/models/schemaUtils'

const notificationSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.String
  },
  typeId: {
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
})

notificationSchema.pre('save', schemaRecordUtils.setPropertyDate('updatedAt'))

export default notificationSchema
