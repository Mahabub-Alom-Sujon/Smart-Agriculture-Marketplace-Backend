import {prisma} from "../../lib/prisma";
import {
    ICreateFarm,
    IFarmQuery,
    IUpdateFarm,
} from "./farm.interface";
import { FarmWhereInput } from "../../../generated/prisma/models/Farm";
import {Role} from "../../../generated/prisma/enums";

const createFarm = async (
    userId: string,
    payload: ICreateFarm,
) => {
    const farmer = await prisma.farmer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer not found");
    }
    const farm = await prisma.farm.create({
        data: {
            farmName: payload.farmName,
            location: payload.location,
            landSize: payload.landSize,
            soilType: payload.soilType,
            farmerId: farmer.id,
        },
    });

    return farm;
};
const getAllFarms = async () => {
    const farms = await prisma.farm.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            farmer: true,
            crops: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return farms;
};

const getAllAdminFarms = async ( query:IFarmQuery ) => {
    const {
        searchTerm,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const andConditions: FarmWhereInput[] = [
        {
            isDeleted: false,
        },
    ];

    if (searchTerm) {
        andConditions.push({
            OR:[
                {
                    farmName:{
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                },
                {
                    location : {
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                },
                {
                    soilType :{
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                },
                {
                    farmer: {
                        name:{
                            contains: searchTerm,
                            mode: "insensitive",
                        }
                    }
                },
                {
                    farmer: {
                        certification: {
                            contains: searchTerm,
                            mode: "insensitive",
                        }
                    }
                }
            ]
        })
    }

    const whereConditions: FarmWhereInput = {
        AND: andConditions,
    };

    const [result, total] = await Promise.all([
        prisma.farm.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder === "asc" ? "asc" : "desc",
            },
            include: {
                farmer: true
            },
        }),

        prisma.farm.count({
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

}

const getFarmById = async (id: string) => {
    const farm = await prisma.farm.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            farmer: true,
            crops: true,
        },
    });

    if (!farm) {
        throw new Error("Farm not found");
    }

    return farm;
};

const getFarmsByFarmer = async (
    farmerId: string,
) => {
    const farmer = await prisma.farmer.findUnique({
        where: {
            id: farmerId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    const farms = await prisma.farm.findMany({
        where: {
            farmerId,
            isDeleted: false,
        },
        include: {
            crops: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return farms;
};

const updateFarm = async (
    id: string,
    farmerId: string,
    payload: IUpdateFarm,
) => {
    const farm = await prisma.farm.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!farm) {
        throw new Error("Farm not found");
    }

    // Ownership check
    if (farm.farmerId !== farmerId) {
        throw new Error(
            "You are not authorized to update this farm",
        );
    }

    const updatedFarm = await prisma.farm.update({
        where: {
            id,
        },
        data: payload,
    });

    return updatedFarm;
};

const deleteFarm = async (
    id: string,
    farmerId: string,
) => {
    const farm = await prisma.farm.findFirst({
        where: {
            id,
        },
    });

    if (!farm) {
        throw new Error("Farm not found");
    }

    // Ownership check
    if (farm.farmerId !== farmerId) {
        throw new Error(
            "You are not authorized to delete this farm",
        );
    }

    const deletedFarm = await prisma.farm.delete({
        where: {
            id,
        },
    });

    return deletedFarm;
};

const deleteAdminFarm = async ( id: string, role: Role )=>{
    // Check Farm exists
    const farm = await prisma.farm.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!farm) {
        throw new Error("Farm not found");
    }

    // =========================
    // ADMIN → Soft Delete
    // =========================

    if (role === Role.ADMIN) {
        const result = await prisma.farm.update({
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
        const result = await prisma.farm.delete({
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


export const FarmService = {
    createFarm,
    getAllFarms,
    getAllAdminFarms,
    getFarmById,
    getFarmsByFarmer,
    updateFarm,
    deleteFarm,
    deleteAdminFarm,
};