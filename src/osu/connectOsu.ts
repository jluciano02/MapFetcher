import { config } from "../config.json"
import { v2, auth } from "osu-api-extended"

export const connectOsu = async () => {
    await auth.login_lazer(config.osuUser, config.osuPass);

  const data = await v2.beatmap.diff(1256136)
  // console.log(data)
}

connectOsu();