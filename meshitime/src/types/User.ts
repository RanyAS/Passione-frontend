export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  address: string;
  image_path: string;
  created_at: string;
}

/** id / created_at は DB が生成 */
export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  address?: string;
  image_path?: string;
  /** Auth UUID と揃える場合に指定 */
  id?: string;
};

export type UpdateUserPayload = Partial<
  Omit<User, "id" | "created_at">
>;
