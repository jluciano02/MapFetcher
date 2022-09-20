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

async function retrieveMap(slot: String, collection: Collection){

    let myMap;
    let mapLink;

    slot = slot.toUpperCase();

    let cursor = collection.find({mapSlot: slot}, {projection: {mapLink: 1} });
    const count = await collection.countDocuments({mapSlot: slot});
    const myMaps = await cursor.toArray();

    let index = Math.floor(Math.random() * (count));
    const doc = myMaps[index];
    return doc?.mapLink;

}

async function handleMessage(m: Message, collection: Collection) {
    if(!m.content.startsWith('%')){
        return;
    }
    let message = (m.content.substring(1));
    let messageSplit = message.split(" ");
    if(message === "ping"){
        m.channel.send("pong");
    }
    if(message === "add"){
        collection.insertOne(
            {"mapLink": "https://osu.ppy.sh/beatmapsets/896080#osu/1872396", "mapSlot": "DT1"}
        );
    }
    if(message === "populate"){
        const result = await collection.insertMany(
            [
              { mapLink: "https://osu.ppy.sh/beatmapsets/1774194#osu/3632723", mapSlot: "NM1" },
              { mapLink: "https://osu.ppy.sh/beatmapsets/1633210#osu/3333669", mapSlot: "NM2" },
              { mapLink: "https://osu.ppy.sh/beatmapsets/1075607#osu/2250670", mapSlot: "NM1" },
              { mapLink: "https://osu.ppy.sh/beatmapsets/1276409#osu/2651915", mapSlot: "NM1" },
              { mapLink: "https://osu.ppy.sh/beatmapsets/1312054#osu/2719284", mapSlot: "NM2" },
              { mapLink: "https://osu.ppy.sh/beatmapsets/1633220#osu/3333699", mapSlot: "NM3" },
            ],
          );
    }
    if(messageSplit[0] === "retrieve"){
        
        const map = await retrieveMap(messageSplit[1], collection);
        m.channel.send(map);

        // retrieveMap(messageSplit[1], collection);
        /*
        const doc = await collection.findOne({mapSlot: "DT1"});
        const map = doc?.mapLink;
        m.channel.send(map); */

    }
    if(message === "test"){
        console.log("NM3".toUpperCase())
    }
    console.log(m.content);
}