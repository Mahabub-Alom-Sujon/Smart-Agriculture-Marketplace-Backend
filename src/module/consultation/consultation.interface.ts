export interface IConsultationQuery {
    searchTerm?: string;
    cropName?: string;
    status?: string;
    farmerId?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface ICreateConsultation {
    cropName?: string;
    problem: string;
    image?: string;
}

export interface IUpdateConsultation {
    cropName?: string;
    problem?: string;
    image?: string;
}

export interface ICreateExpertAdvice {
    diagnosis: string;
    recommendation: string;
    fertilizer?: string;
    pesticide?: string;
}

export interface IUpdateExpertAdvice {
    diagnosis?: string;
    recommendation?: string;
    fertilizer?: string;
    pesticide?: string;
}