import { CropStatus } from "../../../generated/prisma/enums";
export interface CreateCropPayload {
    name: string;
    variety?: string;
    plantingDate?: string;
    harvestDate?: string;
    status?: CropStatus;
    farmId: string;
}

export interface UpdateCropPayload {
    name?: string;
    variety?: string | null;
    plantingDate?: string | null;
    harvestDate?: string | null;
    status?: CropStatus;
    farmId?: string;
}