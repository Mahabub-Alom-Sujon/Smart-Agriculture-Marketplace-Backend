import {prisma} from "../../lib/prisma";

const getAllFarmers =async()=>{
    const farmers = await prisma.farmer.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            farms: true,
            //crops: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return farmers;
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


export const FarmerService = {
    getAllFarmers,
    getFarmerById
};