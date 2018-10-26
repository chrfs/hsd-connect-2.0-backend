import mongoose from 'mongoose'
import {schemaUtils} from '../utils/models'

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Array,
    validate: {
      validator: schemaUtils.validateLength(20, 300),
      message:
        'The content length has to be between 20 and 300 characters.'
    }
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

CommentSchema.pre('update', schemaUtils.setRecordDate('updatedAt'))

const Comment = mongoose.model('posts', CommentSchema)

export const findPostComments = (query) => Comment.find(query)

export const findComment = query => Comment.findOne(query)

export const createComment = async newComment => {
  try {
    return new Comment(newComment).save()
  } catch (err) {
    throw err
  }
}
