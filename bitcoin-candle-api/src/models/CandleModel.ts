import { model, Document, Schema } from 'mongoose';


export interface ICandle extends Document {
    currency: string;
    finalDateTime: Date;
    open: number;
    close: number;
    high: number;
    low: number;
    color: string;
}

const schema = new Schema<ICandle>({
    currency: { type: String, required: true },
    finalDateTime: { type: Date, required: true },
    open: { type: Number, required: true },
    close: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    color: { type: String, required: true }
})

export const CandleModel = model<ICandle>('Candle', schema);