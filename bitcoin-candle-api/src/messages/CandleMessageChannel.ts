import { config } from 'dotenv'
import { Channel, connect } from 'amqplib'
import CandleController from 'src/controllers/CandleController';
import { Server } from 'socket.io';
import * as http from 'http';
import { ICandle } from 'src/models/CandleModel';

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
        this._createMessageChannel();
    }

    private async _createMessageChannel() {
        try {
            const connection = await connect('amqp://admin@admin@localhost:5672');
            this._channel = await connection.createChannel();
            this._channel.assertQueue('candles');
        } catch (error) {
            console.log('Connection to RabbitMQ failed');
            console.log(error);

        }
    }

    async consumeMessages() {
        this._channel.consume('candles', async msg => {
            const candleObj = JSON.parse(msg.content.toString());
            console.log('Received candle:', candleObj);
            this._channel.ack(msg);

            const candle: ICandle = candleObj;
            await this._candleCtrl.save(candle);
            console.log('Candle saved to database');
            this._io.emit('newCandle', candle);
        });

        console.log('Candle consumer stated');
    }
}