import { config } from 'dotenv'
import { Channel, connect } from 'amqplib'
import CandleController from '../controllers/CandleController';
import { Server } from 'socket.io';
import * as http from 'http';
import { ICandle } from '../models/CandleModel';

config()

export default class CandleMessageChannel {
    private _channel: Channel;
    private _candleCtrl: CandleController;
    private _io: Server;

    constructor(server: http.Server) {
        this._candleCtrl = new CandleController();
        this._io = new Server(server, {
            cors: {
                origin: 'http://localhost:8080',
                methods: ['GET', 'POST']
            }
        });
        this._io.on('connection', () => console.log('Websocket connected'));

    }

    private async _createMessageChannel() {
        try {
            const connection = await connect('amqp://admin:admin@localhost:5672');
            this._channel = await connection.createChannel();
            this._channel.assertQueue('candles');
        } catch (error) {
            console.log('Connection to RabbitMQ failed');
            console.log(error);

        }
    }

    async consumeMessages() {
        await this._createMessageChannel();
        if (this._channel) {
            this._channel.consume('candles', async msg => {
                const candleObj = JSON.parse(msg.content.toString());
                console.log('Received candle:', candleObj);
                this._channel.ack(msg);

                const candle: ICandle = candleObj;
                await this._candleCtrl.save(candle);
                console.log('Candle saved to database')
                this._io.emit(process.env.SOCKET_EVENT_NAME, candle)
                console.log('New candle emited by web socket')
            });

            console.log('Candle consumer stated');
        }
    }
}