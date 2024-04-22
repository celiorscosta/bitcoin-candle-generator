import { config } from 'dotenv'
import { connect } from 'mongoose'

export const connectToMongoDB = async () => {
    config()
    try {
        await connect("mongodb://localhost/candles")
        console.log('MongoDB connected')
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}