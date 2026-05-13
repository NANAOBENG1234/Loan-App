import cloudinary from "../config/cloudinary";
import fs from "fs";

export class UploadService {
  async uploadToCloudinary(filePath: string, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `quickloan/${folder}`,
      transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
    });
    fs.unlink(filePath, () => {});
    return result.secure_url;
  }
}
