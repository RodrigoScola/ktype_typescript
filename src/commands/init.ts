import { program } from "commander";
import { GetSession, NewSession, SaveSession, Session } from "../lib/sessions/session";
import path from "path";
import { replaceUnwantedCharacters } from "../..";

export async function ParseOptions(CurrentSession: Session | undefined) {
    return new Promise((res) => {
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

                res(true)
            });
        if (process.argv.length > 2) {
            program.parse()
        }
        res(true)
    })
}
