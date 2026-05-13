import { Request, Response, NextFunction } from "express";
import { UploadService } from "../services/upload.service";
import prisma from "../config/db";
import { VerificationType } from "@prisma/client";

const uploadService = new UploadService();

const VALID_TYPES: string[] = ["selfie", "ghana_card_front", "ghana_card_back"];

export async function uploadVerificationImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const type = req.body.type || "selfie";
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` });
    }

    const imageUrl = await uploadService.uploadToCloudinary(req.file.path, `verifications/${type}`);

    const verification = await prisma.verification.create({
      data: {
        userId: req.user!.id,
        type: type as VerificationType,
        imageUrl,
        status: "pending",
      },
    });

    res.status(201).json(verification);
  } catch (error) {
    next(error);
  }
}
