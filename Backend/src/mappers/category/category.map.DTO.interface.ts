export interface ICategoryDTO {
    _id: string,
    name: string,
    description: string,
    imageUrl?: string;
    isActive: boolean
}

export interface ICategoryEntity {
    _id: string,
    name: string,
    description: string,
    imageUrl?: string;
    isActive: boolean
}