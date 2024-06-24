import { program } from "commander";
import { SESSION_PATH } from '../constants'
import { GetSession, NewSession, SaveSession, Session } from "../lib/sessions/session";
import path from "path";
import { replaceUnwantedCharacters } from "../..";
import { getSessionFromPath } from "./sessions";
import { readFileSync, readdirSync } from "fs";
import { Sentences } from "../lib/sentences/Sentences";
import { Sentence } from "../lib/sentences/sentence";

export async function ParseOptions(CurrentSession: Session | undefined): Promise<boolean> {
    return new Promise((res) => {
        program.command('profile')

            .description("shows the stats of sessions and stuff")
            .action(async (str) => {

                const sentences = new Sentences([])
                const sessionPaths = readdirSync(SESSION_PATH)
                for (const sessPatf of sessionPaths) {


                    const session: Session = JSON.parse(readFileSync(`${SESSION_PATH}/${sessPatf}/sessions.json`, { encoding: "utf8" }))


                    const sentences = new Sentences([])

                    for (const entry of session.entry) {
                        const correct = entry.letters.filter(letter => !letter.wrong)
                            .map(letter => letter.char)
                            .join("")

                        const Sen = new Sentence(correct, entry.id)

                        for (const letter of entry.letters) {
                            Sen.Add(letter.char)
                        }
                        sentences.Add(Sen)
                        console.log(Sen)

                    }

                    sentences.GetStats(sentences.sentences)

                }



                res(false)
            })
        program.command('file')
            .description('accepts a file path to get a new session on')
            .argument('<string>', 'filepath')
            .action(async (str, _options) => {
                const sessionName = path.basename(str)


                if (GetSession(sessionName)) {
                    //handle session existing if they want to create a  new one or something
                }

                const text = await Bun.file(str).text()
                // make a better one where theres a min char maybe
                CurrentSession = NewSession(sessionName, text
                    .split("\n\n")
                    .map(i => i.trim())
                    .filter(s => String(s) && s.length > 0)
                    .map((item, index) =>
                    ({
                        id: index, value: replaceUnwantedCharacters(item)

                    })))


                SaveSession(CurrentSession)
                console.log("this is true")

                res(true)
            });
        if (process.argv.length > 2) {
            program.parse(process.argv,)
        }
        res(true)
    })
}
