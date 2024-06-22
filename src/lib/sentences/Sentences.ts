import { Sentence } from './sentence'

export class Sentences {
    sentences: Sentence[]
    private index: number
    private current: Sentence
    constructor(sentences: Sentence[]) {
        this.sentences = sentences
        this.index = 0
        this.current = this.sentences[this.index]
    }
    Add(sentence: Sentence) {
        this.sentences.push(sentence)
    }

    Next() {
        this.index++
        if (this.index >= this.sentences.length) {
            return
        }
        this.current = this.sentences[this.index]
        return this.Current()
    }
    Previous() {
        this.index--
        this.current = this.sentences[this.index]
        return this.Current()
    }
    Current() {
        return this.current
    }
    DisplayStats() {
        let letterAmount = 0
        let correctOnes = 0
        let wrongOnes = 0
        let rightSpaces = 0

        for (let i = 0; i < this.index; i++) {
            const sen = this.sentences[i]
            letterAmount += sen.SentenceRaw().length
            const letters = sen
                .SentenceRaw()
                .filter((s) => !s.wrong && !s.ignore).length
            correctOnes += letters
            wrongOnes += sen.SentenceRaw().filter((s) => s.wrong).length

            rightSpaces += sen
                .SentenceRaw()
                .filter(s => !s.wrong && s.char !== ' ').length



            const firstLetter = sen.SentenceRaw()[0]
            const lastLetter = sen.SentenceRaw().findLast((s) => s)!

            const time = (lastLetter.createdAt - firstLetter.createdAt) / 1000


            console.log(
                time,
                `seconds to type ${letters} letters ${Math.round(
                    letters / time
                )} letters per second `
            )
        }

        console.log(`spaces -> ${rightSpaces}`)
        console.log(`sentences -> ${this.index}`)
        console.log(`letters -> ${letterAmount}`)
        console.log(`correct letters -> ${correctOnes}`)
        console.log(`wrong  letters -> ${wrongOnes}`)
    }
    Display() {
        if (!this.Current()) {
            this.DisplayStats()
            return
        }
        this.Current().Display()
    }
}
