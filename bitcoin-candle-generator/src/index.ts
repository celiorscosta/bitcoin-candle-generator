import { config } from 'dotenv';
import express from 'express';
import Period from './enums/Period';
import Candle from './Models/Candle';
import { createMessageChannel } from './messages/messageChannel';

const app = express();

config();

const readMarkedPrice = async (): Promise<number> => {
    const result = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await result.json();
    return (data as any).bitcoin.usd;
}

const generateCandle = async () => {
    const messageChannel = await createMessageChannel();
    if (messageChannel) {
        while (true) {
            const loopTimes = Period.THIRTY_SECONDS / Period.TEN_SECONDS;
            const candle = new Candle('BTC');

            console.log('------------------------------------------------------');
            console.log('New candle created');

            for (let i = 0; i < loopTimes; i++) {
                const price = await readMarkedPrice();
                candle.addValue(price);
                console.log(`Marked price: ${i + 1} of ${loopTimes}`);
                await new Promise(resolve => setTimeout(resolve, Period.THIRTY_SECONDS));
            }

            candle.closeCandle();
            console.log('Candle closed');
            const candleObj = candle.toSimpleObject();
            console.log(candleObj);
            const candleJson = JSON.stringify(candleObj);
            messageChannel.sendToQueue('candles', Buffer.from(candleJson));
            console.log('Candle Enqueued');
        }
    }
}

generateCandle();