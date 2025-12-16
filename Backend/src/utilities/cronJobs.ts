import cron from 'node-cron';
import TYPES from '../inversify/inversify.types';
import container from '../inversify/inversify.container';
import { IWorkerRepository } from '../repositories/worker/worker.repo.interface';
import { IWorker } from '../model/worker/worker.interface';
import { IAvailabilityRepository } from '../repositories/availability/availability.repo.interface';
import logger from './logger';
import { ISubscriptionRepository } from '../repositories/subscription/subscription.repo.interface';
import path from 'node:path';
import fs from 'node:fs';

const workerRepository = container.get<IWorkerRepository>(TYPES.workerRepository);
const availabilityRepository = container.get<IAvailabilityRepository>(TYPES.availabilityRepository);
const subRepository = container.get<ISubscriptionRepository>(TYPES.subscriptionRepository);

export const initCronJobs = () => {
    subscriptionExpiryJob.start();
    availabilityCleanupJob.start();
    CleanupLogs.start()
    logger.info("Cron jobs initialized ");
};

const subscriptionExpiryJob = cron.schedule("0 0 * * *", async () => {
    try {
        logger.info("Running subscription expiry job...");
        const now = new Date();
        const allWorkers = await workerRepository.find();

        const planExpiredWorkers = allWorkers.filter(
            (worker: IWorker) =>
                worker?.subscription?.endDate &&
                new Date(worker.subscription.endDate) <= now
        );

        for (const worker of planExpiredWorkers) {
            await subRepository.delete(worker?.subscription?.plan?.toString() as string)
            const success = await workerRepository.setPlanExpired(worker.id);
            if (success) {
                logger.info(`Subscription expired for worker: ${worker.id}`);
            } else {
                logger.warning(`Could not expire subscription for worker: ${worker.id}`);
            }
        }

        logger.info(`Total expired: ${planExpiredWorkers.length}`);
    } catch (error) {
        logger.error("Error in subscription expiry job:", error);
    }
});

const availabilityCleanupJob = cron.schedule("0 0 * * *", async () => {
    try {
        logger.info("Running availability cleanup job...");
        const removedCount = await availabilityRepository.removeExpiredDates();
        logger.info(`Removed expired availability dates from ${removedCount} worker(s).`);
    } catch (error) {
        logger.error("Error in availability cleanup job:", error);
    }
});

const CleanupLogs = cron.schedule("0 0 */3 * *", async () => {
    try {
        const logFiles = [
            path.join(__dirname, "../../../logs/error.log"),
            path.join(__dirname, "../../../logs/combined.log"),
        ];

        for (const file of logFiles) {
            if (fs.existsSync(file)) {
                fs.truncateSync(file, 0);
            }
        }

        logger.info("Log files cleared successfully (retention applied)");
    } catch (error) {
        logger.error("Error during log cleanup job:", error);
    }
});
