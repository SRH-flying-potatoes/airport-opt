const { MongoClient } = require("mongodb");
const { MongoKey } = require("./keys")
const express = require("express")
const cors = require("cors")


//DB
const uri = "mongodb+srv://meghapandit752:" + MongoKey + "@cluster0.ax0atko.mongodb.net/?retryWrites=true&w=majority"

async function run() {
    const clientConn = new MongoClient(uri)
    try {
        await clientConn.connect()
        const db = clientConn.db("airport")
        const collect = db.collection("airport-data")
        const airportCursor = await collect.find({});
        let airportData = []
        for await (const airportDoc of airportCursor) {
            airportData.push(airportDoc)
        }
        return airportData
    } finally {
        await clientConn.close();

    }
}

async function getFlightRoutes({ from, to }) {
    const clientConn = new MongoClient(uri)
    try {
        await clientConn.connect()
        const db = clientConn.db("airport")
        const collect = db.collection("routes")
        const routeCursor = await collect.find({ 'Source airport': from, 'Destination airport': to });
        let routesData = []
        for await (const airportDoc of routeCursor) {
            routesData.push(airportDoc)
        }
        return routesData
    } finally {
        await clientConn.close();

    }
}

// express backend server
const app = express()
app.use(express.static("public"))
app.use(express.json())
app.use(cors())

//express routes
app.get("/cities", (req, res) => {
    run().then((data) => { res.json({ airportData: data }) })
})
app.get('/flightroutes/', (req, res) => {
    getFlightRoutes(req.query).then((data) => { res.json({ routesData: data }) })
})

app.listen(5000) //create an express server

// run().catch(console.dir);
