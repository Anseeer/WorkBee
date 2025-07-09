
export interface Iwrite<T>{
    create(user:Partial<T>):Promise<T>;
    resetPassword(email:string,hashedPass:string):Promise<boolean>;
    delete(id:string):Promise<boolean>;
}

export interface Iread<T>{
    findById(id:string):Promise<T>;
    findByEmail(email:string):Promise<T>;
}