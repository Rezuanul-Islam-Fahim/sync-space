import mongoose from 'mongoose'
import config from '../../common/config.js'
import logger from '../../utils/logger.js'

const mongooseOptions = {}

export const initDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            logger.info('Mongoose connected to DB.')
        })

        mongoose.connection.on('error', (err) => {
            logger.error('Mongoose connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose disconnected.')
        })

        await mongoose.connect(config.db.uri, mongooseOptions)
    } catch (err) {
        throw err
    }
}

export const closeDB = async () => {
    try {
        await mongoose.connection.close()
    } catch (err) {
        throw err
    }
}