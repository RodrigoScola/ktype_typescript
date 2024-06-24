import { colors } from '../../constants'
import { lines } from '../display/lines'


export class Letter {
    ignore: boolean

    readonly createdAt: number
    constructor(readonly char: string, public position: number, readonly color: string, public wrong: boolean) {
        this.ignore = false
        this.createdAt = Date.now()

    }

    Display() {
        let str = this.color + this.char + colors.Reset;
        return str
    }
}

export class Sentence {
    private csen: Letter[]
    private sentence: Letter[]
    constructor(sentence: string, public readonly id: number) {
        this.csen = this.ToLetters(sentence)
        this.sentence = []
    }
    ToLetters(str: string): Letter[] {
        return str.split('').map((ch, index) => new Letter(ch, index, colors.FgCyan, false))
    }
    Get(index: number) {
        for (const item of this.sentence) {
            if (item.ignore) continue
            if (item.position === index) {
                return item
            }
        }
    }
    Length() {
        if (this.sentence.length === 0) return 0
        for (let i = this.sentence.length - 1; i >= 0; i--) {
            const char = this.sentence[i]
            if (!char.ignore) {
                return char.position
            }
        }
        return 0
    }
    GetLast() {
        if (this.sentence.length === 0) return
        for (let i = this.sentence.length - 1; i >= 0; i--) {
            const char = this.sentence[i]
            if (!char.ignore) {
                return char
            }
        }
    }
    Remove(position: number) {
        for (let i = this.sentence.length - 1; i >= 0; i--) {
            const char = this.sentence[i]
            if (!char.ignore && char.position === position) {
                char.ignore = true
                return
            }
        }
    }
    SentenceRaw() {
        return this.sentence
    }

    Sentence() {
        let str = "";
        for (const char of this.sentence) {
            if (char.ignore) {
                continue
            }
            str += char.char;
        }
        return str
    }
    Check(str: string) {
        const last = this.GetLast()
        if (!last) {
            return this.csen[0].char === str
        }
        const want = this.csen[last.position + 1];
        if (!want || last.wrong) return false
        const check = want.char === str && last.wrong == false


        //console.log(`check ->`, check)
        //console.log(`wantchar ->`, want.char === str)
        //console.log(`lastWrong`, this.csen[last.position])


        return check

    }
    Add(char: string) {
        const pos = (this.GetLast()?.position ?? -1) + 1
        let correct = this.Check(char)


        this.sentence.push(new Letter(char, pos, correct ? colors.FgYellow : colors.FgRed, !correct))
    }
    IsComplete(): boolean {
        const last = this.GetLast();
        if (!last) return false;

        let gsentenceLength = 0;
        for (let i = 0; i < this.sentence.length; i++) {
            if (!this.sentence[i].ignore) gsentenceLength++;
        }



        if (gsentenceLength < this.csen.length) return false
        //console.log(`last pos -> ${last.position}`)
        //console.log(`last c -> ${this.csen.length - 1}`)


        for (const char of this.sentence) {
            if (char.ignore) continue
            if (char.wrong) {
                //        console.log(s)
                return false
            }
        }
        return true
    }
    ToEntry() {
        return {
            id: this.id,
            endAt: this.GetLast()!.createdAt,
            letters: this.SentenceRaw(),
            startAt: this.SentenceRaw().find(s => s)!.createdAt
        }
    }
    Display() {
        let str = ""
        for (const char of this.sentence) {
            if (!char || char.ignore) continue
            str += char.Display()
        }

        let startAt = 0
        const last = this.GetLast()
        if (last) {
            startAt = last.position + 1
        }
        for (let i = startAt; i < this.csen.length; i++) {
            const char = this.csen[i]
            if(char) str += char.Display()

        }

        const cols = process.stdout.columns
        const rows = process.stdout.rows

process.stdout.write(
            lines.padAbove(
                lines.padAround(str, 10, cols), rows / 3) + '\n',)
    }
}

