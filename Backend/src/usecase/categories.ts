import { ICategory } from "../domain/entities/ICategory";
import { categoriesRepository } from "../repository/categoriesRepository";

export class CategoriesUsecase {
  private categoriesRepo: categoriesRepository;

  constructor(categoriesRepo: categoriesRepository) {
    this.categoriesRepo = categoriesRepo;
  }

  getAllCategories = async (): Promise<ICategory[]> => {
    const categories = await this.categoriesRepo.getAllCategories();
    return categories;
  };
}
