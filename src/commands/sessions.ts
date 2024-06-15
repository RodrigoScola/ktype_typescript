import { input, select, Separator } from '@inquirer/prompts'
import { readdirSync, mkdirSync, existsSync, rmdirSync, readFileSync } from 'fs';


function getOptions(dirs: string[]): { name: string, value: string }[] {
    return dirs.map(d => ({ name: d, value: d }))
}

export async function getSessions(path: string) {
    const dirs = readdirSync(path)

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
        rmdirSync(`${path}/${removeName}`)
    }

    if (option === 'create') {
        const res = await input({
            message: "what is the session name?",
        })
        if (!existsSync(res)) {
            console.log(path + res)
            mkdirSync(`${path}/${res}`);
        }
    }
    return readFileSync(`${path}/${option}`, { encoding: "utf-8" })
}
