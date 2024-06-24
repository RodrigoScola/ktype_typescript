import path from 'node:path'


import readline from 'readline'
import { Menu } from './src/lib/sentences/Menu'
import { Sentences } from './src/lib/sentences/Sentences'
import { Sentence } from './src/lib/sentences/sentence'
import { program } from 'commander'
import { getSessionFromPath } from './src/commands/sessions'
import { Session, GetSession, NewSession, SaveSession } from './src/lib/sessions/session'
import { GetNextSentence, SaveEntry } from './src/lib/sessions/actSession'
import { ParseOptions } from './src/commands/init'

export function replaceUnwantedCharacters(str: string) {
    return str
        .replaceAll('—', '-')
        .replaceAll("“", '"')
        .replaceAll('”', '"')
}


function handleComplete(sentences: Sentences, sentence: Sentence) {
   SaveEntry(CurrentSession!, sentence.ToEntry())

    const newSen = sentences.Next()
    sentences.DisplayStats()
    if (newSen) sentence = newSen
    return

}

let CurrentSession: Session | undefined;



ParseOptions(CurrentSession).then(async (res: boolean) => {
    (async (shouldRun: boolean) => {

        if (shouldRun === false) {

            return
        }

        CurrentSession = GetSession('The-Time-Machine.txt')


        if (!CurrentSession) {
            CurrentSession = await getSessionFromPath()
        }

        if (!CurrentSession) {
            console.log("asodf")
            throw new Error("come ojn men")
        }
        readline.emitKeypressEvents(process.stdin)
        process.stdin.setRawMode(true)

        process.stdin.resume()
        console.clear()
        const lastSentence = GetNextSentence(CurrentSession).id || 0

        //const master = new Sentences([ new Sentence("---", 0)])

        const master = new Sentences(CurrentSession.content
            .filter(content => content.id - 1 > lastSentence)
            .map(s => new Sentence(replaceUnwantedCharacters(s.value) , s.id)))

//        const master = new Sentences([new Sentence("Hello there good job", 0)])


        const menu = new Menu()
        menu.Add(master)


        menu.ToDisplay(master)
        menu.Display()

        //function printLines(amount: number) {
        //    for (let i = 0; i < amount; i++) {
        //        process.stdout.write('\n')
        //    }
        //}


        process.stdin.on(
            'keypress',
            (
                str: string,
                key: {
                    sequence: string
                    name: string
                    ctrl: boolean
                    meta: boolean
                    shift: boolean
                }
            ) => {
                if (key.name === 'c' && key.ctrl) {
                    process.exit()
                }

                let sentence = master.Current()

                menu.Refresh()
                menu.Display()
                //printLines(process.stdout.rows / 4)

                if (sentence.IsComplete()) {
                    handleComplete(master, sentence)
                    menu.ToDisplay(sentence)
                    menu.Display()
                    return
                }

                if (key.name === 'backspace') {
                    sentence.Remove(sentence.Length())
                    menu.ToDisplay(sentence)
                    menu.Display()
                    return
                } else if (str == '\u0017') {
                    //sentence.Remove(getLastDelimiter(master.Current().Sentence()))
                } else if (key.name === 'return' && sentence.IsComplete()) {
                    SaveEntry(CurrentSession!, sentence.ToEntry())
                    const newSen = master.Next()
                    if (newSen) sentence = newSen
                    return
                } else {
                    if (key.name !== 'return') {
                        sentence.Add(str)
                    }
                }
                if (sentence.IsComplete()) {
                    handleComplete(master, sentence)
                    return
                }

                menu.ToDisplay(sentence)
                menu.Display()
            }
        )
    })(res)
})
