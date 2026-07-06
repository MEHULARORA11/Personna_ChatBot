import {Agent} from '@openai/agents'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {mainAgentInstruction} from './instruction.ts'
import{
    weatherTool,
    sendEmailToUserTool,
    youtubeVideoSearchingTool,
    youtubePlaylistSearchingTool
} from '../subTools.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const model = 'gpt-4o-mini'


export const piyushAgent = new Agent({
    name:`Piyush's Agent`,
    model,
    instructions: mainAgentInstruction,
    tools:[
    weatherTool,
    sendEmailToUserTool,
    youtubeVideoSearchingTool,
    youtubePlaylistSearchingTool
    ]
})