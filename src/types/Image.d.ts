import mongoose from 'mongoose'
export interface ImageInterface extends mongoose.Document {
  name: string
  token: string
  size: number
  mime: string
  path: string
  orderNo?: number | undefined
  isActive?: boolean
  createdAt: Date
}
