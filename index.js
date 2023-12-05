const express = require("express");
const amqp = require("amqplib");
const app = express();

var channel, connection;

const PORT = process.env.PORT || 4002;

app.use(express.json());

connectQueue();

async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://guest:guest@:5672");
        channel = await connection.createChannel();

        await channel.assertQueue("deviceEvent");

        //queue'daki mesaj consume ile okunuyor. ilk parametre olarak queue'nın ismi ikinci parametre olarak ise callback şeklinde mesajı döndürüyor.
        channel.consume("deviceEvent", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data); //mesajın alındığını belirtiyor.
        })
    } catch (error) {
        console.log(error);
    }
}

app.listen(PORT, () => console.log("Server running at port " + PORT));