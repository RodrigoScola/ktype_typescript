import { colors } from '../../constants'

class LetterStats {
    readonly createdAt: number
    constructor(createdAt: number) {
        this.createdAt = createdAt
    }

}

class Letter {
    ignore: boolean
    stats: LetterStats
    constructor(readonly char: string, public position: number, readonly color: string, public wrong: boolean) {
        this.ignore = false
        this.stats = new LetterStats(Date.now())

    }

    Display() {
        process.stdout.write(this.color)
        process.stdout.write(this.char)
        process.stdout.write(colors.Reset)

    }
}

export class Sentence  {
    private csen: Letter[]
    private sentence: Letter[]
    constructor(sentence: string) {
        this.csen = this.ToLetters(sentence)
        this.sentence = []
    }
    ToLetters(str: string): Letter[] {
        return str.split('').map((ch, index) => new Letter(ch, index, colors.FgBlue, false))
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
        return this.sentence.filter(s => !s.ignore).map(s => s.char).join("")
    }
    Check(str: string) {
        const last = this.GetLast()
        if (!last) {
            return this.csen[0].char === str
        }
        const want = this.csen[last.position + 1];
        if (!want) return false


        return want.char === str

    }
    Add(char: string) {
        const pos = (this.GetLast()?.position ?? -1) + 1
        let correct = this.Check(char)

        this.sentence.push(new Letter(char, pos, correct ? colors.FgYellow : colors.FgRed, !correct))
    }
    IsComplete(): boolean {
        const last = this.GetLast();
        if (!last) return false;
        const goodSentence = this.sentence.filter(s => !s.ignore)

        if (goodSentence.length < this.csen.length) return false
        //console.log(`last pos -> ${last.position}`)
        //console.log(`last c -> ${this.csen.length - 1}`)

        let wr = true;

        goodSentence.forEach(s => {
            if (s.ignore) return

            if (s.wrong) {
                //        console.log(s)
                wr = false;
            }
        })

        //console.log(`com -> ${wr}`)


        return wr
    }
    Display() {
        for (const char of this.sentence) {
            if (!char || char.ignore) continue
            char.Display()
        }

        let startAt = 0
        if (this.GetLast()) {
            startAt = this.GetLast()!.position + 1
        }
        for (let i = startAt; i < this.csen.length; i++) {
            const char = this.csen[i]

            char.Display()

        }
        process.stdout.write('\n')
    }
}

