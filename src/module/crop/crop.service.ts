import {prisma} from "../../lib/prisma";
import {CreateCropPayload, ICropQuery, UpdateCropPayload} from "./crop.interface";
import {CropStatus, Role} from "../../../generated/prisma/enums";
import {CropWhereInput} from "../../../generated/prisma/models/Crop";
import {FarmWhereInput} from "../../../generated/prisma/models/Farm";

const createCrop = async (
    userId: string,
    payload: CreateCropPayload
) => {
    const farm = await prisma.farm.findUnique({
        where: {
            id: payload.farmId,
            isDeleted: false,
        },
    });

    if (!farm) {
        throw new Error("Farm not found");
    }

    // Make sure the farm belongs to the logged-in farmer
    const farmer = await prisma.farmer.findUnique({
        where: {
            userId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer profile not found");
    }

    if (farm.farmerId !== farmer.id) {
        throw new Error("You are not authorized to create crop for this farm");
    }

    const crop = await prisma.crop.create({
        data: {
            name: payload.name,
            variety: payload.variety,
            plantingDate: payload.plantingDate
                ? new Date(payload.plantingDate)
                : undefined,
            harvestDate: payload.harvestDate
                ? new Date(payload.harvestDate)
                : undefined,
            status: payload.status,
            farmId: payload.farmId,
        },
        include: {
            farm: true,
        },
    });

    return crop;
};
const getAllCrops = async (
    query: ICropQuery,
    userId: string,
) => {
    const {
        searchTerm,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Find logged-in farmer
    const farmer = await prisma.farmer.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!farmer) {
        throw new Error("Farmer profile not found");
    }

    // Ownership filter: only crops belonging to this farmer's farms
    const andConditions: CropWhereInput[] = [
        {
            isDeleted: false,
            farm: {
                farmerId: farmer.id,
                isDeleted: false,
            },
        },
    ];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    variety: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    farm: {
                        farmName: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    farm: {
                        location: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }

    const whereConditions: CropWhereInput = {
        AND: andConditions,
    };

    const [result, total] = await Promise.all([
        prisma.crop.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder === "asc" ? "asc" : "desc",
            },
            include: {
                farm: true,
            },
        }),

        prisma.crop.count({
            where: whereConditions,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: result,
    };
};

const getCropsByFarm = async (farmId: string) => {
    const farm = await prisma.farm.findFirst({
        where: {
            id: farmId,
            isDeleted: false,
        },
    });

    if (!farm) {
        throw new Error("Farm not found");
    }

    return prisma.crop.findMany({
        where: {
            farmId,
            isDeleted: false,
        },
        include: {
            farm: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getCropById = async (id: string) => {
    const crop = await prisma.crop.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            farm: true,
        },
    });

    if (!crop) {
        throw new Error("Crop not found");
    }

    return crop;
};

const updateCrop = async (
    userId: string,
    id: string,
    payload: UpdateCropPayload
) => {
    const crop = await prisma.crop.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            farm: true,
        },
    });

    if (!crop) {
        throw new Error("Crop not found");
    }

    const farmer = await prisma.farmer.findUnique({
        where: {
            userId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer profile not found");
    }

    if (crop.farm.farmerId !== farmer.id) {
        throw new Error("You are not authorized to update this crop");
    }

    if (payload.farmId) {
        const newFarm = await prisma.farm.findFirst({
            where: {
                id: payload.farmId,
                isDeleted: false,
            },
        });

        if (!newFarm) {
            throw new Error("New farm not found");
        }

        if (newFarm.farmerId !== farmer.id) {
            throw new Error("You are not authorized to move crop to this farm");
        }
    }

    const updatedCrop = await prisma.crop.update({
        where: {
            id,
        },
        data: {
            name: payload.name,
            variety: payload.variety,
            plantingDate: payload.plantingDate !== undefined ? payload.plantingDate ? new Date(payload.plantingDate) : null : undefined,
            harvestDate: payload.harvestDate !== undefined ? payload.harvestDate ? new Date(payload.harvestDate) : null : undefined,
            status: payload.status,
            farmId: payload.farmId,
        },
        include: {
            farm: true,
        },
    });

    return updatedCrop;
};

const updateCropStatus = async (
    userId: string,
    id: string,
    status: CropStatus
) => {
    const crop = await prisma.crop.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            farm: true,
        },
    });

    if (!crop) {
        throw new Error("Crop not found");
    }

    const farmer = await prisma.farmer.findUnique({
        where: {
            userId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer profile not found");
    }

    if (crop.farm.farmerId !== farmer.id) {
        throw new Error("You are not authorized to update this crop");
    }

    return prisma.crop.update({
        where: {
            id,
        },
        data: {
            status,
        },
        include: {
            farm: true,
        },
    });
};

const deleteCrop = async (
    userId: string,
    id: string
) => {
    const crop = await prisma.crop.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            farm: true,
        },
    });

    if (!crop) {
        throw new Error("Crop not found");
    }

    const farmer = await prisma.farmer.findUnique({
        where: {
            userId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer profile not found");
    }

    if (crop.farm.farmerId !== farmer.id) {
        throw new Error("You are not authorized to delete this crop");
    }

    await prisma.crop.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return null;
};

const deleteAdminCrop = async ( id: string, role: Role )=>{
    // Check Farm exists
    const farm = await prisma.crop.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!farm) {
        throw new Error("Crop not found");
    }

    // =========================
    // ADMIN → Soft Delete
    // =========================

    if (role === Role.ADMIN) {
        const result = await prisma.crop.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });

        return result;
    }

    // =========================
    // SUPER_ADMIN → Permanent Delete
    // =========================

    if (role === Role.SUPER_ADMIN) {
        const result = await prisma.crop.delete({
            where: {
                id,
            },
        });

        return result;
    }

    // =========================
    // Other Roles → Not Allowed
    // =========================
    throw new Error("You are not authorized to delete this category");

}

export const CropService = {
    createCrop,
    getAllCrops,
    getCropsByFarm,
    getCropById,
    updateCrop,
    updateCropStatus,
    deleteCrop,
    deleteAdminCrop
};