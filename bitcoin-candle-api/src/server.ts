import { config } from 'dotenv';
import { connection } from 'mongoose';
import { app } from './app';
import { connectToMongoDB } from './config/db';



const createServer = async () => {
    config();
    await connectToMongoDB();
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    process.on('SIGINT', async () => {
        await connection.close()
        server.close();
        console.log('Server to mongoDB closed');
    });
}

createServer();
