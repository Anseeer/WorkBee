export interface ISlot {
  _id: string;
  date: string;         
  bookedSlots: string[];
}

export interface IAvailability {
  _id: string;
  workerId: string;
  availableDates: ISlot[];
  createdAt: string;
  updatedAt: string;
}
