import cron from 'node-cron';
import TYPES from '../inversify/inversify.types';
import container from '../inversify/inversify.container';
import { IWorkerRepository } from '../repositories/worker/worker.repo.interface';
import { IWorker } from '../model/worker/worker.interface';
import { IAvailabilityRepository } from '../repositories/availability/availability.repo.interface';

const workerRepository = container.get<IWorkerRepository>(TYPES.workerRepository);
const availabilityRepository = container.get<IAvailabilityRepository>(TYPES.availabilityRepository);

export const initCronJobs = () => {
    subscriptionExpiryJob.start();
    availabilityCleanupJob.start();
    console.log("Cron jobs initialized ");
};

const subscriptionExpiryJob = cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running subscription expiry job...");
        const now = new Date();
        const allWorkers = await workerRepository.find();

        const planExpiredWorkers = allWorkers.filter(
            (worker: IWorker) =>
                worker?.subscription?.endDate &&
                new Date(worker.subscription.endDate) <= now
        );

        for (const worker of planExpiredWorkers) {
            const success = await workerRepository.setPlanExpired(worker.id);
            if (success) {
                console.log(`Subscription expired for worker: ${worker.id}`);
            } else {
                console.warn(`Could not expire subscription for worker: ${worker.id}`);
            }
        }

        console.log(`Total expired: ${planExpiredWorkers.length}`);
    } catch (error) {
        console.error("Error in subscription expiry job:", error);
    }
});


const availabilityCleanupJob = cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running availability cleanup job...");
        const removedCount = await availabilityRepository.removeExpiredDates();
        console.log(`Removed expired availability dates from ${removedCount} worker(s).`);
    } catch (error) {
        console.error("Error in availability cleanup job:", error);
    }
});