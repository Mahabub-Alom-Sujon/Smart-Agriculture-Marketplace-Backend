export interface CreateCategory {
    name: string;
    description?: string;
    image?: string;
}

export interface IQuery {
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}