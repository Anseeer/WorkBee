import mongoose from "mongoose";
import logger from "../../utilities/logger";

const MongooseConnection = () => {
    logger.info('Trying to Conect...')
    try {
        mongoose.connect(process.env.MONGODB_URI as string)
            .then(() => {
                logger.info("DB Contected Successfully...")
            })
            .catch((err) => {
                logger.error("DB Connection Faild ", err)
            })
    } catch (error) {
        logger.error("Faild To Connect", error);
    }
}

export default MongooseConnection;