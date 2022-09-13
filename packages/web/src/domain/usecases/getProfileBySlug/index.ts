export interface GetProfileBySlugClass {
  idSerial: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: any | null;
  avatarId: number | null;
  id: string;
}

export interface GetProfileBySlugResponse {
  getProfileBySlug: GetProfileBySlugClass;
}
