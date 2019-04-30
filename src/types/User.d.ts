import { ImageInterface } from "./Image";
import { Document } from "mongoose";

export namespace UserNamespace {
  export interface UserInterface extends Document {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    settings: SettingsInterface;
    optionalInformation: OptionalInformationInterface;
    bookmarkedProjects: any[];
    authorization: {
      isUser: boolean;
      isModerator: boolean;
      isSuperuser: boolean;
    };
    notifications: NotificationInterface[];
    image: ImageInterface;
  }

  interface SettingsInterface {
    language: string;
    receiveNotification: boolean;
  }

  interface OptionalInformationInterface {
    major: string;
    expectedGraduation: {
      month: number;
      year: number;
    };
  }

  export interface NotificationInterface extends Document {
    origin: string;
    originId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}
