import { ImageInterface } from './Image'
import { UserNamespace } from './User'
import { Document } from 'mongoose'

export interface ProjectFeedbackInterface extends Document {
  project?: string
  user?: string
  likedBy: string[]
  content?: string
  comments: ProjectFeedbackCommentInterface[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ProjectFeedbackCommentInterface extends Document {
  user: UserNamespace.UserInterface
  content: string
  updatedAt: Date
  createdAt: Date
}

export interface ProjectInterface extends Document {
  user?: UserNamespace.UserInterface | any
  title?: string
  description?: string
  images?: ImageInterface[]
  likedBy: string[]
  members?: string[]
  searchingParticipants?: boolean
  isActive?: boolean
  updatedAt?: Date
  createdAt?: Date
}
