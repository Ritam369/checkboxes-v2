import http from 'node:http'
import path from 'node:path'

import express from 'express'
import { Server } from 'socket.io'
import 'dotenv/config'

//websockets can't be directly used by express server
//to have websockets, we need node:http server
//here express is used for handling HTTP requests

const main = async () => {
    const app = express()
    const httpServer = http.createServer(app)

    const io = new Server(httpServer)

    //SocketIO Handlers
    io.on("connection", (socket) => {
        console.log(`A user connected ${socket.id}`)

        socket.on("client:checkbox:change", (data) => {
            console.log(`Checkbox changed by ${socket.id}:`, data);
            io.emit("server:checkbox:change", data)
        })
    })

    //Express Handlers
    const port = process.env.PORT || 4000

    app.use(express.static(path.resolve('./public'))) //this is a middleware which will help the server serve static files that are within the public folder, je routes gulo index.js e mention ache segulo toh thikache jegulo nei taar jonno public folder er modhye thaka files gulote check korbe (by default public folder er modhye thaka index.html er kachei aage jabe)

    app.get('/health', (req, res) => {
        res.json({ healthy: true })
    })

    httpServer.listen(port, () => console.log(`Server running on  http://localhost:${port}`))
}

main()