import { input, select, Separator } from '@inquirer/prompts'
import { readdirSync, mkdirSync, existsSync, rmdirSync, rmSync } from 'fs';
import { GetSession } from '../lib/sessions/session';
import { SESSION_PATH } from '../constants';


function getOptions(dirs: string[]): { name: string, value: string }[] {
    return dirs.map(d => ({ name: d, value: d }))
}



export async function getSessionFromPath(): Session | undefined {
    const dirs = readdirSync(SESSION_PATH)

    const sessions = getOptions(dirs)

    const option = await select({
        message: 'Select a package manager',
        choices: [
            ...sessions,
            new Separator(),
            {
                name: 'create session',
                value: 'create',
                //disabled: true,
            },
            {
                name: 'remove session',
                value: 'remove',
                //disabled: true,
            },
        ],
    });

    if (option === 'remove') {
        const removeName = await select({
            message: 'Select a session to remove',
            choices: sessions,
        })

        rmSync(`${SESSION_PATH}/${removeName}`, { force: true, recursive: true })
        return getSessionFromPath()
    }

    if (option === 'create') {
        const res = await input({
            message: "what is the session name?",
        })
        if (!existsSync(res)) {
            console.log(SESSION_PATH + res)
            mkdirSync(`${SESSION_PATH}/${res}`);
        }
    }
    return GetSession(option)

}
