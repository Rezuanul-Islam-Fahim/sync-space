import mongoose from 'mongoose'
import config from '../config/index.js'

const mongooseOptions = {}

export const initDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB.')
        })

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected.')
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