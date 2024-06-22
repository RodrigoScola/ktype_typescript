import { writeSync, readdirSync, mkdirSync, existsSync, rmdirSync, readFileSync, writeFileSync } from 'fs';
import { SESSION_PATH } from '../../constants';
import { Letter } from '../sentences/s2';

export type SessionEntry = {
    startAt: number,
    endAt: number,
    id: number
    letters: Letter[]
}

type SessionChar = {
    char: string, correct: boolean, createdAt: number
}
type SentenceStats = {
    words: SessionChar[],
}

type SessionContent = { id: number, value: string }

export function SessionExists(sessionName: string) {
    return readdirSync(SESSION_PATH).includes(sessionName)
}

export type Session = {
    name: string,
    entry: SessionEntry[],
    statistics: SentenceStats[],
    content: SessionContent[],
}

export function NewSession(name: string, content: SessionContent[]): Session {
    return {
        name,
        entry: [],
        statistics: [],
        content
    }
}

export function GetSession(sessionName: string) {
    const mypath = `${SESSION_PATH}/${sessionName}/sessions.json`
    if (!existsSync(mypath)) {
        return
    }

    return JSON.parse(readFileSync(mypath, { encoding: 'utf8' }))
}

export function SaveSession(session: Session) {
    const dirPath = `${SESSION_PATH}/${session.name}`
    const mypath = `${SESSION_PATH}/${session.name}/sessions.json`

    if (!existsSync(dirPath)) {
        mkdirSync(dirPath)
    }

    writeFileSync(mypath, JSON.stringify(session), {
        encoding: "utf8"
    })

    console.log(session.entry)

    return session
}
