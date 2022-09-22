import { Client, Intents, Message } from "discord.js";
import { Collection, Db} from "mongodb";
import config from "./config.json";
import { connectDatabase } from "./database/connectDatabase"
import { connectOsu } from "./osu/connectOsu"
import { v2 } from "osu-api-extended"
import { Map } from "./maps.types"


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
    const osuTest = await connectOsu();

    BOT.on("ready", () => console.log("Connected to Discord!"));
    BOT.on("messageCreate", (m)=>handleMessage(m, mongoCollection));

    await BOT.login(config.config.token);
  })();

// Get beatmap ID from a given beatmap link
async function getMapID(map: String): Promise<number>{   
    let mapArray = map.split("/");
    let mapID = mapArray[mapArray.length - 1];

    let mapIDNum = parseInt(mapID);

    return mapIDNum;
}

// Add map to database from map link
async function addMap(map: String, mapSlot: String, collection: Collection){

    let mapID = await getMapID(map);
    mapSlot = mapSlot.toUpperCase();

    const mapData = await v2.beatmap.diff(mapID);

    collection.insertOne({
        "mapLink": map,
        "mapSlot": mapSlot,
        "mapID": mapID,
        "difficulty": mapData.difficulty_rating,
        "cs": mapData.cs,
        "bpm": mapData.bpm,
        "ar": mapData.ar
    })
}

async function parsePool(){
    // TODO
}

// Add maps to database from pool spreadsheet
async function addPool(){
    // TODO
}

async function fetchMap(slot: String, collection: Collection){

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
    if(messageSplit[0] === "add"){
        addMap(messageSplit[1], messageSplit[2], collection);
        
        /*
        collection.insertOne(
            {"mapLink": "https://osu.ppy.sh/beatmapsets/896080#osu/1872396", "mapSlot": "DT1"}
        ); */
    }
    if(messageSplit[0] === "fetch"){
        
        const map = await fetchMap(messageSplit[1], collection);
        m.channel.send(map);

    }
    if(message === "test"){
        console.log("NM3".toUpperCase())
    }
    console.log(m.content);
}