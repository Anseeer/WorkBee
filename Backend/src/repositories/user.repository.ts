import UserModel,{ Iuser } from "../model/userSchema";

export class UserRepository{

    async create(user:Partial<Iuser>):Promise<Iuser>{
        const newUser = new UserModel(user);
        return await newUser.save();
    }

    async findById(id:string|undefined):Promise<Iuser|null>{
        return await UserModel.findById(id);
    }

    async findByEmail(email:string):Promise<Iuser|null>{
        return await UserModel.findOne({email});
    }

    async resetPassword(email: string, hashedPass: string): Promise<void> {
    await UserModel.updateOne(
        { email },
        { $set: { password: hashedPass } }
    );
    }


}