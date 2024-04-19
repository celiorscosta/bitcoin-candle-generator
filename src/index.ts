import { config } from 'dotenv';
import express from 'express';

const app = express();

config();

const readMarkedPrice = async (): Promise<number> => {
    const result = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await result.json();
    console.log(data);
    return 1;
}

readMarkedPrice();