
export interface Iwrite<T> {
    create(item: Partial<T>): Promise<T>;
    resetPassword(userId: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export interface Iread<T> {
    findById(id: string): Promise<T>;
    findByEmail(email: string): Promise<T>;
}