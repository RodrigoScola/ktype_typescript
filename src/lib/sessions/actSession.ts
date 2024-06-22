import { writeFileSync } from "node:fs";
import { Session, SessionEntry } from './session'
import { SESSION_PATH } from "../../constants";

export function GetNextSentence(session: Session) {

    const lastEntry = session.entry[session.entry.length - 1];
    if (!lastEntry) {
        return session.content[0]
    }
    for (let i = 0; i < session.content.length; i++) {
        const sess = session.content[i]

        if (sess.id === lastEntry.id) {
            return session.content[i + 1]
        }
    }
    return session.content[0]
}

export function SaveEntry(session: Session, entry: SessionEntry) {
    session.entry.push(entry)

    writeFileSync(
        `${SESSION_PATH}/${session.name}/sessions.json`,
        JSON.stringify(session)
    )
}

export function ToEntry() {
}
