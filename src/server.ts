import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
const server = express();
server.use(express.json());

var corsOptions = {
	origin: function (origin: any, callback: Function) {
		// db.loadOrigins is an example call to load
		// a list of origins from a backing database
		console.log(origin);
	},
};
server.use(cors(corsOptions));

export default server;
