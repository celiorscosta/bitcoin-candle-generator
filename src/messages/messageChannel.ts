import { config } from 'dotenv';
import { Channel, connect } from 'amqplib'

export const createMessageChannel = async (): Promise<Channel> => {
    config();
    try {
        const connection = await connect('amqp://admin:admin@localhost:5672')//process.env.AMQP_SERVER);
        const channel = await connection.createChannel();
        await channel.assertQueue('candles');
        console.log('Connected to RabbitMQ')
        return channel;
    }
    catch (error) {
        console.error('Error while trying to connect to RabbitMQ server: ', error);
        return null;
    }
}

