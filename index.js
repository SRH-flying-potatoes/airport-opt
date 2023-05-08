const { MongoClient } = require("mongodb");
const { MongoKey } = require("./keys")

const uri = "mongodb+srv://meghapandit752:" + MongoKey + "@cluster0.ax0atko.mongodb.net/?retryWrites=true&w=majority"
const clientConn = new MongoClient(uri)

async function run() {
    try {
        await clientConn.connect()
        const db = clientConn.db("airport")
        const collect = db.collection("airport-data")
        const airportCursor = await collect.find({});
        for await (const airportDoc of airportCursor) {
            console.log(airportDoc);
        }

    } finally {
        await clientConn.close();

    }
}
run().catch(console.dir);
