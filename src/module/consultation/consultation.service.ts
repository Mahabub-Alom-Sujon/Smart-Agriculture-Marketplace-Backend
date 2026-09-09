import { prisma } from "../../lib/prisma";
import {
    IConsultationQuery,
    ICreateConsultation,
    IUpdateConsultation,
    ICreateExpertAdvice,
    IUpdateExpertAdvice,
} from "./consultation.interface";
import {ConsultationStatus} from "../../../generated/prisma/enums";

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
        throw new Error("Farmer not found");
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
        throw new Error("Farmer not found");
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
    userId: string
) => {
    const farmer = await prisma.farmer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!farmer) {
        throw new Error("Farmer not found");
    }
    const consultation =
        await prisma.consultation.findFirst({
            where: {
                id,
                farmerId : farmer.id ,
                isDeleted: false,
            },
        });

    if (!consultation) {
        throw new Error("Consultation not found");
    }
    if(
        consultation.status === ConsultationStatus.ACCEPTED ||
        consultation.status === ConsultationStatus.COMPLETED
    ){
        throw new Error(`Cannot delete a consultation that has already been ${consultation.status.toLowerCase()}`)
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

// ==================================================
// Create Expert Advice
// ==================================================
const createExpertAdvice = async (
    consultationId: string,
    userId: string,
    payload: ICreateExpertAdvice
) => {
    const expert = await prisma.expert.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!expert) {
        throw new Error("Expert Profile is not found");
    }
    const consultation =
        await prisma.consultation.findFirst({
            where: {
                id: consultationId,
                isDeleted: false,
            },

            include: {
                advice: {
                    where: {
                        isDeleted: false,
                    },
                },
            },
        });

    if (!consultation) {
        throw new Error("Consultation not found");
    }

    // Because consultationId is @unique
    if (consultation.advice) {
        throw new Error(
            "Advice already exists for this consultation"
        );
    }

    const result = await prisma.expertAdvice.create({
        data: {
            consultationId,
            expertId : expert.id,
            diagnosis: payload.diagnosis,
            recommendation: payload.recommendation,
            fertilizer: payload.fertilizer,
            pesticide: payload.pesticide,
        },

        include: {
            expert: true,
            consultation: true,
        },
    });

    // Automatically mark consultation as answered
    await prisma.consultation.update({
        where: {
            id: consultationId,
        },

        data: {
            status: "COMPLETED",
        },
    });

    return result;
};

// ==================================================
// Get Advice By Consultation
// ==================================================
const getConsultationAdvice = async (
    consultationId: string
) => {
    const result = await prisma.expertAdvice.findFirst({
        where: {
            consultationId,
            isDeleted: false,
        },

        include: {
            expert: true,
            consultation: true,
        },
    });

    if (!result) {
        throw new Error("Expert advice not found");
    }

    return result;
};

// ==================================================
// Update Expert Advice
// ==================================================
const updateExpertAdvice = async (
    consultationId: string,
    userId: string,
    payload: IUpdateExpertAdvice
) => {
    const expert = await prisma.expert.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!expert) {
        throw new Error("Expert Profile is not found");
    }
    const advice =
        await prisma.expertAdvice.findFirst({
            where: {
                consultationId,
                expertId : expert.id,
                isDeleted: false,
            },
        });

    if (!advice) {
        throw new Error("Expert advice not found");
    }

    const result = await prisma.expertAdvice.update({
        where: {
            id: advice.id,
        },

        data: payload,

        include: {
            expert: true,
            consultation: true,
        },
    });

    return result;
};

// ==================================================
// Delete Expert Advice
// ==================================================
const deleteExpertAdvice = async (
    consultationId: string,
    userId: string
) => {
    const expert = await prisma.expert.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!expert) {
        throw new Error("Expert Profile is not found");
    }
    const advice =
        await prisma.expertAdvice.findFirst({
            where: {
                consultationId,
                expertId:expert.id,
                isDeleted: false,
            },
        });

    if (!advice) {
        throw new Error("Expert advice not found");
    }

    const result = await prisma.expertAdvice.update({
        where: {
            id: advice.id,
        },

        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    // Consultation goes back to pending/review state
    await prisma.consultation.update({
        where: {
            id: consultationId,
        },

        data: {
            status: "CANCELLED",
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

    createExpertAdvice,
    getConsultationAdvice,
    updateExpertAdvice,
    deleteExpertAdvice,
};