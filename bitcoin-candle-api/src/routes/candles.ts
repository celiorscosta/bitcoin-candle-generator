import { Router } from "express";
import CandleController from "../controllers/CandleController";

export const candlesRouter = Router();
const candleCtrl = new CandleController();

candlesRouter.get('/:quantity', async (req, res) => {
    const quantity = parseInt(req.params.quantity);
    const candles = await candleCtrl.findLastCandles(quantity);
    res.json(candles);
});