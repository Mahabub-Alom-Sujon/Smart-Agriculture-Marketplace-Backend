import {IExpertQuery} from "../expert/expert.interface";

export interface ICreateFarm {
    farmName: string;
    location: string;
    landSize?: number;
    soilType?: string;
}

export interface IUpdateFarm {
    farmName?: string;
    location?: string;
    landSize?: number;
    soilType?: string;
}

export interface IFarmParams {
    id: string;
}

export interface IFarmerParams {
    farmerId: string;
}

export interface IFarmQuery {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}