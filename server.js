import express from "express"
import {appendFileSync} from 'fs'
const app = express()

app.use(express.static('./'));
app.use(express.json());

app.post('/stats', (req, res) => {
    console.log(req.body)
    appendFileSync('statistic.txt', JSON.stringify(req.body) + '\n')
});

app.listen(3000, () => {
    console.log('солнце светит сервер пашет')
})