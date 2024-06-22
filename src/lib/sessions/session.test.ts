import { beforeAll, describe, expect, assert, it } from 'vitest'
import { SESSION_PATH } from '../../constants'
import fs, { readFileSync, } from 'node:fs'
import { NewSession, SaveSession, Session } from './session'


let session: Session = NewSession("the man that flew across time", [{ id: 0, value: "this is the man that flew across time" }])
beforeAll(() => {
    SaveSession(session)
})


describe.concurrent("sessions", () => {
    it("path should exist // i forget sometimes", () => {
        assert.isTrue(fs.existsSync(SESSION_PATH))
    })
    it("creates a session and saves it", () => {
        assert.isTrue(fs.existsSync(`${SESSION_PATH}/${session.name}/session.json`))
    })
    it("session has the same content", () => {
        const savedSession: Session = JSON.parse(readFileSync(`${SESSION_PATH}/${session.name}/session.json`, { encoding: 'utf8' }))
        expect(savedSession.name).equals(session.name)
        expect(savedSession.content).toEqual(session.content)
    })

})
