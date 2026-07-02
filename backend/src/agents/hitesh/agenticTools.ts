import {Agent} from '@openai/agents'
import {z} from 'zod'
import axios from 'axios'
import {weatherTool,sendEmailToUserTool,youtubeVideoSearchingTool} from './subTools.ts'
import {weatherAgentInstruction,emailAgentInstruction,youtubeVideoSearchingAgentInstruction} from './instruction.ts'

const model = 'gpt-4o-mini'

export const weatherAgent = new Agent({
    name:'weatherAgent',
    instructions:weatherAgentInstruction,
    model,
    tools:[weatherTool]
})
export const emailAgent = new Agent({
    name:'emailAgent',
    instructions:emailAgentInstruction,
    model,
    tools:[sendEmailToUserTool]
})




export const youtubeVideoSearchingAgent = new Agent({
    name:'youtubeVideoSearchingAgent',
    instructions:youtubeVideoSearchingAgentInstruction,
    model,
    tools:[youtubeVideoSearchingTool]
})
