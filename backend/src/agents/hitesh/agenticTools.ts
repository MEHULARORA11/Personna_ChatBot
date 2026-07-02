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
export const youtubePlaylistSearchingAgent = new Agent({
    name:'youtubeVideoSearchingAgent',
    instructions:youtubePlaylistSearchingAgentInstruction,
    model,
    tools:[youtubePlaylistSearchingTool]
})
