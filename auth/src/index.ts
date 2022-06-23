import 'express-async-errors';
import express from "express";
import { checkVars, envVars } from "./config/env.config";
import { NotFoundException } from "./errors/notfound-error";
import { authRouter } from "./routes/auth.routes";
import { healthRrouter } from "./routes/health.routes";
import { errorHandler } from './controllers/error.controller';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import roleService from './services/role.service';

async function start() {
    checkVars();

    await mongoose.connect(envVars.MONGO_URI);

    /**
     * DBs seed
     */

    const roles = ["admin", "visitors"];

    for await (const role of roles) {
        await roleService.createIfNotExists(role);
    }

    const app = express();
    app.set('trust proxy', 1);


    /**
     * Map Middlewares
     */

    app.use(express.json({limit: '10mb'}));
    app.use(cookieSession({
        signed: false,
        httpOnly: true,
    }));

    /**
     * Map routes
     */

    app.use('/api/auth', authRouter);
    app.use('/api/auth', healthRrouter);

    app.all('*', (req, res) => {
        throw new NotFoundException();
    });

    app.use(errorHandler);

    app.listen(envVars.PORT, () => console.log("Listening", `http://localhost:${envVars.PORT}`));
}

start();