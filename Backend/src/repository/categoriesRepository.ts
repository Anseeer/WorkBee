import { ICategory } from "../domain/entities/ICategory";
import CategoryModel from "../infastructure/models/categorySchema";
import BaseRepository from "./baseRepostitory";



export class categoriesRepository extends BaseRepository<ICategory> {
    constructor(){
        super(CategoryModel)
    }

   async getAllCategories(): Promise<ICategory[]> {
    return await this.model.find({ isActive: true });
  }
}