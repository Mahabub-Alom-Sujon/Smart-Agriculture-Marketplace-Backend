export interface IRegisterExpertPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    specialization?: string;
    qualification?: string;
    experience?: number;
}


export interface IExpertQuery {
    searchTerm?: string;
    city?: string;
    specialization?: string;
    qualification?: string;
    minExperience?: string;
    maxExperience?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}