import express from 'express'
import { Test } from './routes/Test'
import http from 'http'

const app = express();
const port = 4000
const name = "GeoChattr"

app.use("/api", Test())

app.get("/", (req, res) => {
    res.json({ success: true, message: `${name} API` })
})

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`)
})