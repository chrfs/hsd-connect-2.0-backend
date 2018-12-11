import mongoose from 'mongoose'
import schemaUtils from '../utils/models/schemaUtils'

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Array,
    validate: {
      validator: schemaUtils.validateLength(20, 300),
      message: 'The content length has to be between 20 and 300 characters.'
    }
  },
  liked_by: {
    type: mongoose.Schema.Types.Array,
    default: []
  },
  comments: {
    type: mongoose.Schema.Types.Array,
    default: []
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  updated_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

PostSchema.pre('update', schemaUtils.setRecordDate('updatedAt'))

const Post = mongoose.model('Post', PostSchema)

export const findProjectPosts = query => Post.find(query)

export const findPost = query => Post.findOne(query)

export const createPost = async newPost => {
  try {
    return new Post(newPost).save()
  } catch (err) {
    throw err
  }
}
export const updatePost = query => Post.update({ _id: query._id }, query)
