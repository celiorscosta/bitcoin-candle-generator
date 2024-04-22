import { ICandle, CandleModel } from "src/models/CandleModel";

export default class CandleController {
    async save(candle: ICandle): Promise<ICandle> {
        const newCandle = await CandleModel.create(candle);
        return newCandle;
    }

    async findLastCandles(quantity: number): Promise<ICandle[]> {
        const n = quantity > 0 ? quantity : 10;
        const lastCandles: ICandle[] =
            await CandleModel
                .find()
                .sort({ _id: -1 })
                .limit(n);

        return lastCandles;
    }
}