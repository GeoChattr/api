import { AuthProvider } from "@prisma/client";

export interface InitialAuthUser {
  id: string;
  email?: string;
  profilePicture: string;
  displayName: string;
  username: string;
  location: string;
  provider?: AuthProvider;
  createdAt?: Date;
  updatedAt?: Date
}