import api from "./api";

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  email?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async updateProfile(data: UpdateProfileInput) {
    const res = await api.put("/users/profile", data);
    return res.data;
  },

  async changePassword(data: ChangePasswordInput) {
    const res = await api.put("/users/password", data);
    return res.data;
  },

  async deleteAccount(password: string) {
    const res = await api.delete("/users/account", { data: { password } });
    return res.data;
  },
};