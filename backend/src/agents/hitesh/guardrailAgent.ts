import {Agent,run,tool} from '@openai/agents'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {z} from 'zod'
import {guardrailAgentInstruction} from './instruction.ts'
import {isAbusive} from './slangs.ts'


const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const model = 'gpt-4o-mini'

const isSafeQuerry = tool({
   name:'isSafeQuerry',
   description:`accepts a userPrompt and tells about weather a query is safe or unsafe `,
   parameters:z.object({
    userPrompt:z.string().describe('user input/query')
   }),
   execute:async({userPrompt}) => {
    const isSafe =  !await isAbusive(userPrompt)
    return{isSafe}
   }
})

export const guardRailAgent = new Agent({
    name:'guardRailAgent',
    instructions:guardrailAgentInstruction,
    outputType:z.object({
        isValidQuery:z.boolean().describe('tells whether the query is valid or not'),
        reason:z.string().optional().describe('reason to reject the query')
    }),
    tools:[isSafeQuerry],
    model,
})
