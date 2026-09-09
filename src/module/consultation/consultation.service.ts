import { prisma } from "../../lib/prisma";
import {
    IConsultationQuery,
    ICreateConsultation,
    IUpdateConsultation,
} from "./consultation.interface";

// ==============================
// Create Consultation
// ==============================
const createConsultation = async (
    userId: string,
    payload: ICreateConsultation
) => {
    const farmer = await prisma.farmer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!farmer) {
        throw new Error("Buyer not found");
    }
    const result = await prisma.consultation.create({
        data: {
            farmerId : farmer.id,
            cropName: payload.cropName,
            problem: payload.problem,
            image: payload.image,
        },
    });

    return result;
};


// ==============================
// Get All Consultations
// ==============================
const getAllConsultations = async (
    query: IConsultationQuery
) => {
    const {
        searchTerm,
        cropName,
        status,
        farmerId,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {
        isDeleted: false,

        ...(status && {
            status,
        }),

        ...(farmerId && {
            farmerId,
        }),

        ...(cropName && {
            cropName: {
                contains: cropName,
                mode: "insensitive",
            },
        }),

        ...(searchTerm && {
            OR: [
                {
                    cropName: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    problem: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        }),
    };

    const [result, total] = await Promise.all([
        prisma.consultation.findMany({
            where,
            skip,
            take: limitNumber,

            orderBy: {
                [sortBy]: sortOrder,
            },

            include: {
                farmer: true,
                advice: {
                    where: {
                        isDeleted: false,
                    },
                    include: {
                        expert: true,
                    },
                },
            },
        }),

        prisma.consultation.count({
            where,
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

// ==============================
// Get Single Consultation
// ==============================
const getSingleConsultation = async (
    id: string
) => {
    const result = await prisma.consultation.findFirst({
        where: {
            id,
            isDeleted: false,
        },

        include: {
            farmer: true,

            advice: {
                where: {
                    isDeleted: false,
                },

                include: {
                    expert: true,
                },
            },
        },
    });

    if (!result) {
        throw new Error("Consultation not found");
    }

    return result;
};

// ==============================
// Update Consultation
// ==============================
const updateConsultation = async (
    id: string,
    userId: string,
    payload: IUpdateConsultation
) => {
    const farmer = await prisma.farmer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!farmer) {
        throw new Error("Buyer not found");
    }
    const consultation =
        await prisma.consultation.findFirst({
            where: {
                id,
                farmerId : farmer.id,
                isDeleted: false,
            },
        });

    if (!consultation) {
        throw new Error("Consultation not found");
    }

    // Farmer can update only pending consultation
    if (consultation.status !== "PENDING") {
        throw new Error(
            "Consultation cannot be updated after review has started"
        );
    }

    const result = await prisma.consultation.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};

// ==============================
// Update Consultation Status
// ==============================
const updateConsultationStatus = async (
    id: string,
    status: string
) => {
    const consultation =
        await prisma.consultation.findFirst({
            where: {
                id,
                isDeleted: false,
            },
        });

    if (!consultation) {
        throw new Error("Consultation not found");
    }

    const result = await prisma.consultation.update({
        where: {
            id,
        },

        data: {
            status: status as any,
        },
    });

    return result;
};


// ==============================
// Delete Consultation
// ==============================
const deleteConsultation = async (
    id: string,
    farmerId: string
) => {
    const consultation =
        await prisma.consultation.findFirst({
            where: {
                id,
                farmerId,
                isDeleted: false,
            },
        });

    if (!consultation) {
        throw new Error("Consultation not found");
    }

    const result = await prisma.consultation.update({
        where: {
            id,
        },

        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};

export const ConsultationService = {
    createConsultation,
    getAllConsultations,
    getSingleConsultation,
    updateConsultation,
    deleteConsultation,
    updateConsultationStatus,
};