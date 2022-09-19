import { Client, Intents, Message } from "discord.js";
import { Collection, Db } from "mongodb";
import config from "./config.json";
import { connectDatabase } from "./database/connectDatabase"

(async () => {
    const BOT = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.MESSAGE_CONTENT
        ],
    });

    const mongoCollection = await connectDatabase();

    BOT.on("ready", () => console.log("Connected to Discord!"));
    BOT.on("messageCreate", (m)=>handleMessage(m, mongoCollection));







    

    await BOT.login(config.config.token);
  })();

async function handleMessage(m: Message, collection: Collection) {
    if(!m.content.startsWith('%')){
        return;
    }
    let message = m.content.substring(1);
    if(message === "ping"){
        m.channel.send("pong");
    }
    if(message === "add"){
        collection.insertOne(
            {"mapLink": "https://osu.ppy.sh/beatmapsets/896080#osu/1872396", "mapSlot": "DT1"}
        );
    }
    if(message === "retrieve"){
        
        const doc = await collection.findOne({mapSlot: "DT1"});

        const map = doc?.mapLink;

        m.channel.send(map);

    }
    console.log(m.content);
}