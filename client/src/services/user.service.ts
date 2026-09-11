import api from "./api";

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  email?: string | null;
}

export const userService = {
  async updateProfile(data: UpdateProfileInput) {
    const res = await api.put("/users/profile", data);
    return res.data;
  },
};