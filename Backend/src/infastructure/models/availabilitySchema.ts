import mongoose, { Schema } from "mongoose";
import { IAvailability, IAvailableSlot, ISlot } from "../../domain/entities/IAvailability";

const slotSchema = new Schema<ISlot>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: function(this:any):boolean{
        return this.isBooked === true;
    }
  },
  scheduleType: {
    type: String,
    enum: ["morning", "afternoon", "evening"],
    required: true
  }
});

const availableSlotsSchema = new Schema<IAvailableSlot>({
  date: {
    type: String, 
    required: true
  },
  slots: {
    type: [slotSchema],
    required: true
  }
});

export const availablitySchema = new Schema<IAvailability>({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  availableSlots: {
    type: [availableSlotsSchema],
    required: true
  }
}, { timestamps: true });

const Availability = mongoose.model<IAvailability>('Availability', availablitySchema);
export default Availability;
