import type { Role } from "../../../generated/prisma/browser";


export interface ILoginUserPayload {
    email: string;
    password: string;
}

export interface IRegisterPatientPayload {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    role: Role;

}


export interface IRequestUser {
    userId: string;
    email: string;
    name: string;
    role: Role;
}

export interface IGoogleLoginPayload {
    idToken: string;
    role: Role;
}