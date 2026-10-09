import {prisma} from "../../lib/prisma";
import {IFarmerQuery} from "./farmer.interface";
import { FarmerWhereInput } from "../../../generated/prisma/models/Farmer";
import {ExpertWhereInput} from "../../../generated/prisma/models/Expert";
import {Role} from "../../../generated/prisma/enums";

const getAllFarmers =async()=>{
    const farmers = await prisma.farmer.findMany({
        where: {
            isDeleted: false,
        },
        select:{
            id:true,
            name:true,
            isDeleted:true,
            deletedAt:true,
            createdAt:true,
            updatedAt:true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return farmers;
};

const getAllAdminFarmers =async(query:IFarmerQuery)=>{
    const {
        searchTerm,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const andConditions: FarmerWhereInput[] = [
        {
            isDeleted: false,
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
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    certification: {
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                },

                // Farm name
                {
                    farms: {
                        some: {
                            farmName: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },

                // Farm location
                {
                    farms: {
                        some: {
                            location: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },

            ],
        });
    }

    const whereConditions: FarmerWhereInput = {
        AND: andConditions,
    };

    const [result, total] = await Promise.all([
        prisma.farmer.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder === "asc" ? "asc" : "desc",
            },
            include: {
                farms: true
            },
        }),

        prisma.farmer.count({
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

const getFarmerById = async (id: string) =>{
    const farmer = await prisma.farmer.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            farms: {
                include: {
                    crops: true
                }
            }
        },
    });
    if (!farmer) {
        throw new Error("Farmer not found");
    }
    return farmer;
}

const deleteFarmer= async (id: string, role: Role) =>{
    // Check category exists
    const farmer = await prisma.farmer.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    // =========================
    // ADMIN → Soft Delete
    // =========================

    if (role === Role.ADMIN) {
        const result = await prisma.farmer.update({
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
        const result = await prisma.farmer.delete({
            where: {
                id,
            },
        });

        return result;
    }

    // =========================
    // Other Roles → Not Allowed
    // =========================
    throw new Error("You are not authorized to delete this Farmer");

}

export const FarmerService = {
    getAllFarmers,
    getFarmerById,
    getAllAdminFarmers,
    deleteFarmer
};