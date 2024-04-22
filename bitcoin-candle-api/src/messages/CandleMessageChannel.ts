import { config } from 'dotenv'
import { Channel } from 'amqplib'
import CandleController from 'src/controllers/CandleController';
import { Server } from 'socket.io';
import * as http from 'http';

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
    }
}