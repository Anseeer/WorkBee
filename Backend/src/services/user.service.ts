import { UserRepository } from "../repositories/user.repository";
import { Iuser } from "../model/userSchema";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';


export class UserService{
    private userRepository : UserRepository;
    constructor(userRepository:UserRepository){
        this.userRepository = userRepository;
    }

    async registerUser(userData:Partial<Iuser>):Promise<{newUser:Iuser,token:string}>{
        if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
        throw new Error("All Fild is required for registration.");
        }

        const userExist = await this.userRepository.findByEmail(userData.email);
        if(userExist){
            throw new Error ('User Already Exist with This Email !');
        }

        let hashedPass = await bcrypt.hash(userData.password,10)
        userData.password = hashedPass;
        const newUser = await this.userRepository.create(userData);

          const secret: Secret = process.env.JWT_SECRET as string;
        const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';
        const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        secret,
        { expiresIn }
        );

        return {newUser,token};
    }

    async loginUser(email:string,password:string):Promise<{user:Iuser,token:string}>{
        let user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new Error ('User Not Found');
        }
        let isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new Error ('Invalid credentials')
        }

        const secret: Secret = process.env.JWT_SECRET as string;
        const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';
        const token = jwt.sign(
        { id: user._id, role: user.role },
        secret,
        { expiresIn }
        );
        return {user,token};
    }

    async getUserById(id:string):Promise<Iuser|null>{
        let user = this.userRepository.findById(id);
        return user
    }

    async getUserByEmail(email:string):Promise<Iuser|null>{
        let user = this.userRepository.findByEmail(email);
        return user
    }

}