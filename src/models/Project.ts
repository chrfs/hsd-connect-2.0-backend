import { ImageInterface } from "Image";
import mongoose from "mongoose";
import { ValidationError } from "../utils/errors";
import { parse } from "../utils/file";
import { projectValidatorErrors } from "../utils/models/projectUtils";
import {
  schemaUtils,
  schemaValidator,
  schemaValidatorMessages
} from "../utils/models/schemaUtils";
import Image from "./sub/Image";

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired("title")]
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired("description")]
  },
  images: {
    type: [Image],
    default: []
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User"
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User"
  },
  searchingParticipants: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  isActive: {
    type: mongoose.Schema.Types.Boolean,
    default: true
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
});
projectSchema.pre("validate", schemaValidator.validateLength("title", 25, 65));
projectSchema.pre(
  "validate",
  schemaValidator.validateLength("description", 300, 4000)
);
projectSchema.pre(
  "validate",
  schemaValidator.validateProperty(
    "title",
    async function(query: any) {
      return !(await Promise.resolve(Project.find(query) as any)).length;
    },
    projectValidatorErrors.uniqueTitle
  )
);
projectSchema.pre("validate", schemaUtils.setPropertyDate("updatedAt"));
projectSchema.pre("validate", function(next) {
  this.images = Array.isArray(this.images) ? this.images : [];
  if (this.images.length > 4) {
    throw ValidationError("images", "The quantity of your images is too much.");
  }
  this.images = this.images.filter((image: ImageInterface) => image.path);
  next();
});

projectSchema.pre("validate", function(next) {
  this.images = Array.isArray(this.images) ? this.images : [];
  const isValid = parse.fileArrSize(this.images) <= 3e6;
  if (!isValid) {
    throw ValidationError(
      "images",
      `The total size of your images is to big! `
    );
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
