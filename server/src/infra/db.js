import mongoose from 'mongoose'
import config from '../config/index.js'

const mongooseOptions = {}

export const initDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB')
        })

        mongoose.connection.on('error', (err) => {
            console.log('Mongoose connection error: ', err)
        })

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected')
        })

        await mongoose.connect(config.db.uri, mongooseOptions)
    } catch (err) {
        console.log('Failed to initialize database connection', err)

        throw err
    }
}