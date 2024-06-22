
interface Displayable {
    Display(): void
}

export class Menu {
    displays: Displayable[]
    private candidate?: Displayable
    position: number
    constructor() {
        this.displays = []
        this.position = 0
        this.candidate;
    }
    ToDisplay(candidate: Displayable) {
        this.candidate = candidate
    }
    Add(display: Displayable) {
        this.displays.push(display)
    }
    Refresh() {
        console.clear()
    }
    Display() {
        if (this.candidate) {
            this.candidate.Display()
            this.candidate = undefined
            return
        }
//        this.displays[this.position].Display()
    }

}
