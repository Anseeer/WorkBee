import cron from 'node-cron';
import TYPES from '../inversify/inversify.types';
import container from '../inversify/inversify.container';
import { IWorkerRepository } from '../repositories/worker/worker.repo.interface';
import { IWorker } from '../model/worker/worker.interface';

const workerRepository = container.get<IWorkerRepository>(TYPES.workerRepository);

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

export const initCronJobs = () => {
    subscriptionExpiryJob.start();
    console.log("Cron jobs initialized (subscription expiry started)");
};