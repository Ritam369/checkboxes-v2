import http from 'node:http'
import path from 'node:path'

import express from 'express'
import { Server } from 'socket.io'
import 'dotenv/config'
import { publisher, subscriber } from './redis-connection.js'

//websockets can't be directly used by express server
//to have websockets, we need node:http server
//here express is used for handling HTTP requests

const main = async () => {
    const app = express()
    const httpServer = http.createServer(app)

    const io = new Server(httpServer)

    const CHECKBOX_COUNT = 1000;

    const state = {
        checkboxes: Array(CHECKBOX_COUNT).fill(false)
    }

    //SocketIO Handlers

    await subscriber.subscribe("internal-server:checkbox:change");

    subscriber.on("message", (channel, message) => {
        if(channel === "internal-server:checkbox:change"){
            const {id, checked} = JSON.parse(message);
            const index = parseInt(id.split('-')[1]);
            state.checkboxes[index] = checked;
            io.emit("server:checkbox:change", {id, checked});
        }
    });

    io.on("connection", (socket) => {
        console.log(`A user connected ${socket.id}`)

        socket.on("client:checkbox:change", async (data) => {
            console.log(`Checkbox changed by ${socket.id}:`, data);
            const index = parseInt(data.id.split('-')[1]);
            // state.checkboxes[index] = data.checked;
            // io.emit("server:checkbox:change", data);
            await publisher.publish("internal-server:checkbox:change", JSON.stringify(data));
        })
    })

    //Express Handlers
    const port = process.env.PORT || 4000

    app.use(express.static(path.resolve('./public'))) //this is a middleware which will help the server serve static files that are within the public folder, je routes gulo index.js e mention ache segulo toh thikache jegulo nei taar jonno public folder er modhye thaka files gulote check korbe (by default public folder er modhye thaka index.html er kachei aage jabe)

    app.get('/health', (req, res) => {
        res.json({ healthy: true })
    })

    app.get('/checkboxes', (req, res) => {
        res.json({checkboxes: state.checkboxes})
    })

    httpServer.listen(port, () => console.log(`Server running on  http://localhost:${port}`))
}

main()