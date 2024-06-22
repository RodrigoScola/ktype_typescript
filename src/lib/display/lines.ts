
class Lines {
    private removeAnsi(str: string) {
        // ANSI color code regex
        const regex = /\x1b\[[0-9;]*m/g;
        return str.replace(regex, '');
    }
    padAbove(str: string, amount: number) {
        return '\n'.repeat(amount) + str
    }
    padAround(str: string, padding: number, totalLen: number) {

        const words = str.split(' ')

        let linelen = padding;

        const finalStr = words.reduce((sentence, word) => {
            const withoutAnsi = this.removeAnsi(word)

            linelen += withoutAnsi.length
            if (linelen + 2  > totalLen - padding * 2 ) {
                sentence += `\n`
                sentence += ' '.repeat(padding  )

                linelen = padding + 1
            }
            sentence += ` ${word}`
            return sentence

        }, " ".repeat(padding))
        return finalStr
    }



}

export const lines = new Lines()
