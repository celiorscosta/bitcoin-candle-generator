import { config } from 'dotenv';
import express from 'express';
import Period from './enums/Period';
import Candle from './Models/Candle';

const app = express();

config();

const readMarkedPrice = async (): Promise<number> => {
    const result = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await result.json();
    console.log(data);
    return 1;
}

const generateCandle = async () => {
    while (true) {
        const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS;

        const candle = new Candle('BTC', new Date());

        console.log('------------------------------------------------------');
        console.log('New candle created');

        for (let i = 0; i < loopTimes; i++) {
            const price = await readMarkedPrice();
            candle.addValue(price);
            console.log(`Marked price: ${price} of ${loopTimes}`);
            await new Promise(resolve => setTimeout(resolve, Period.TEN_SECONDS));
        }

        candle.closeCandle();
        console.log('Candle closed');
        console.log(candle.toSimpleObject());
    }
}

generateCandle();