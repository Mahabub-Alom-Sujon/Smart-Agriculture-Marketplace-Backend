export interface CreateCategory {
    name: string;
    description?: string;
    image?: string;
}

export interface Query {
    page?: string;
    limit?: string;
    searchTerm?: string;
}