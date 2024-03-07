"use server"
import { Request, Response } from 'express';

const express = require('express')
const app = express();
const port = 3000;

app.get('/api/captions', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

