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