import {Agent} from '@openai/agents'
import{
    weatherTool,
    sendEmailToUserTool,
    youtubeVideoSearchingTool,
    youtubePlaylistSearchingTool
} from './subTools.ts'
import {
weatherAgentInstruction,
emailAgentInstruction,
youtubeVideoSearchingAgentInstruction,
youtubePlaylistSearchingAgentInstruction
} from './instruction.ts'
import {z} from 'zod'

const model = 'gpt-4o-mini'

export const weatherAgent = new Agent({
    name:'weatherAgent',
    instructions:weatherAgentInstruction,
    model,
     outputType:z.object({
        temperature:z.string().describe('temperature of the city'),
        climate:z.string().describe('climate details of the city')
    }),
    tools:[weatherTool]
})
export const emailAgent = new Agent({
    name:'emailAgent',
    instructions:emailAgentInstruction,
    model,
    outputType:z.object({
        isEmailSended:z.boolean().describe('tells weather the email sended successfully or not')
    }),
    tools:[sendEmailToUserTool]
})




export const youtubeVideoSearchingAgent = new Agent({
    name:'youtubeVideoSearchingAgent',
    instructions:youtubeVideoSearchingAgentInstruction,
    model,
    tools:[youtubeVideoSearchingTool]
})
export const youtubePlaylistSearchingAgent = new Agent({
    name:'youtubeVideoSearchingAgent',
    instructions:youtubePlaylistSearchingAgentInstruction,
    model,
    tools:[youtubePlaylistSearchingTool]
})
