import mongoose from 'mongoose'
import schemaUtils from '../utils/models/schemaUtils'

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  content: {
    type: mongoose.Schema.Types.Array,
    validate: {
      validator: schemaUtils.validateLength(20, 300),
      message: 'The content length has to be between 20 and 300 characters.'
    }
  },
  updated_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

commentSchema.pre('update', schemaUtils.setRecordDate('updatedAt'))
const Comment = mongoose.model('Comment', commentSchema)

export const findComments = query => Comment.find(query)

export const createComment = async newComment => {
  try {
    return new Comment(newComment).save()
  } catch (err) {
    throw err
  }
}
