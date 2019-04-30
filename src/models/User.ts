import mongoose from "mongoose";
import { UserNamespace } from "User";
import {
  schemaUtils,
  schemaValidator,
  schemaValidatorMessages
} from "../utils/models/schemaUtils";
import {
  userRecordUtils,
  userValidationErrors,
  userValidator
} from "../utils/models/userUtils";
import Image from "./sub/Image";
import UserNotification from "./sub/UserNotification";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: mongoose.Schema.Types.String,
      required: [true, schemaValidatorMessages.isRequired("firstname")]
    },
    lastname: {
      type: mongoose.Schema.Types.String,
      required: [true, schemaValidatorMessages.isRequired("lastname")]
    },
    email: {
      type: mongoose.Schema.Types.String,
      unique: true,
      required: [true, schemaValidatorMessages.isRequired("e-mail")]
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: [true, schemaValidatorMessages.isRequired("password")]
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        language: "de",
        receiveNotifications: true
      }
    },
    optionalInformation: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        major: "",
        expectedGraduation: {
          month: null,
          year: null
        }
      }
    },
    bookmarkedProjects: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
      default: []
    },
    authorization: {
      type: mongoose.Schema.Types.String,
      default: "IS_USER",
      enum: ["IS_USER", "IS_MODERATOR", "IS_SUPERUSER"]
    },
    notifications: {
      type: [UserNotification],
      default: []
    },
    image: {
      type: Image
    },
    isActive: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    verificationCode: {
      type: mongoose.Schema.Types.String,
      default: ""
    },
    isVerified: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    updatedAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now()
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now()
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);
userSchema.pre("validate", userRecordUtils.setNameOfEmail);
userSchema.pre("validate", userValidator.validateEmail);
userSchema.pre(
  "validate",
  schemaValidator.validateProperty(
    "email",
    async function(query: string) {
      return !(await Promise.resolve(User.find(query) as any)).length;
    },
    userValidationErrors.uniqueEmail
  )
);
userSchema.pre("validate", userValidator.validatePassword);
userSchema.pre("validate", userRecordUtils.setHashedPassword);
userSchema.pre("validate", schemaUtils.setPropertyDate("updatedAt"));

const User = mongoose.model<UserNamespace.UserInterface>("User", userSchema);

export default User;
