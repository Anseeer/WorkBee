export interface IAvailableSlot {
  _id?: string;
  jobId?: string | null;
  booked?: boolean;
  slot: "morning" | "afternoon" | "evening" | "full-day";
}

export interface ISlot {
  _id?: string;
  date: string | Date;
  availableSlots: IAvailableSlot[];
}

export interface IAvailability {
  _id?: string;
  workerId: string;
  availableDates: ISlot[];
  createdAt?: string;
  updatedAt?: string;
}
