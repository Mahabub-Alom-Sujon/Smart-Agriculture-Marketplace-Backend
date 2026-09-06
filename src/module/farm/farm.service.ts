import {prisma} from "../../lib/prisma";
import {
    ICreateFarm,
    IUpdateFarm,
} from "./farm.interface";

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

const getFarmById = async (id: string) => {
    const farm = await prisma.farm.findUnique({
        where: {
            id,
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
    const farm = await prisma.farm.findUnique({
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
    const farm = await prisma.farm.findUnique({
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


export const FarmService = {
    createFarm,
    getAllFarms,
    getFarmById,
    getFarmsByFarmer,
    updateFarm,
    deleteFarm,
};