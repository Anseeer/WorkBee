import type { ICategory } from "../types/ICategory";
import type { IWorker } from "../types/IWorker";
import axios from "./axios";


export const register = async (workerData:Partial<IWorker>)=>{
    const response = await axios.post("workers/register",workerData);
    return response;
}

export const getAllCategories = async (): Promise<ICategory[]> => {
  const res = await axios.get("/categories/getAllCategories"); 
  console.log(res.data.data)
  return res.data.data.categories;
};