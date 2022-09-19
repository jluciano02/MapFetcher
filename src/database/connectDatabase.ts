import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";
import { config } from "../config.json"

export const connectDatabase = async () => {
const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 } as MongoClientOptions);
client.connect();
const collection = client.db("test").collection("devices");
    return collection;
}