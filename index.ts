import readline from 'readline'
import { Menu } from './src/lib/sentences/Menu'
import { Sentences } from './src/lib/sentences/Sentence'
import { Sentence } from './src/lib/sentences/s2'
import { select } from '@inquirer/prompts';
import { getSessions } from './src/commands/sessions';

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

//async function main() {



const s = await getSessions(`${process.cwd()}/data/sessions`)


const master = new Sentences([new Sentence(s)])

//const master = new Sentences([
//    new Sentence('this is the new one'),
//    new Sentence('this is the other one that should appear'),
//    new Sentence('this is the second to last sentence'),
//    new Sentence('this is the last one'),
//])

const menu = new Menu()
menu.Add(master)

function getLastDelimiter(sen: string) {
    const seps = `~!@#$%^&*()-=+[{]}\|;:'",.<>/? `
        .split('')
        .map((ch) => sen.lastIndexOf(ch))
    return Math.max(...seps)
}

printLines(process.stdout.rows / 4)
menu.Display()

function printLines(amount: number) {
    for (let i = 0; i < amount; i++) {
        process.stdout.write('\n')
    }
}

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
        printLines(process.stdout.rows / 4)

        if (sentence.IsComplete()) {
            const newSen = master.Next()
            if (newSen) sentence = newSen
            menu.Display()
            return
        }

        if (key.name === 'backspace') {
            sentence.Remove(sentence.Length())
            menu.Display()
            return
        } else if (str == '\u0017') {
            sentence.Remove(getLastDelimiter(master.Current().Sentence()))
        } else if (key.name === 'return') {
            const newSen = master.Next()
            if (newSen) sentence = newSen
        } else {
            sentence.Add(str)
        }

        menu.ToDisplay(sentence)
        menu.Display()
    }
)
//}

//main()
