import { Schema, model, models } from "mongoose";

const RepairRequestSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    deviceType: { type: String, required: true },
    brand: { type: String, default: "" },
    problem: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["جدید", "در حال بررسی", "در حال تعمیر", "تمام شده"],
      default: "جدید",
    },
  },
  { timestamps: true }
);

export const RepairRequest =
  models.RepairRequest || model("RepairRequest", RepairRequestSchema);