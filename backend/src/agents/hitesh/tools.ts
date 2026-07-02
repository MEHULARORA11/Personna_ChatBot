import {Agent} from '@openai/agents'
import {z} from 'zod'
import axios from 'axios'
import {weatherTool,sendEmailToUserTool} from './subTools.ts'

const model = 'gpt-4o-mini'

export const weatherAgent = new Agent({
    name:'weatherAgent',
    instructions:`
    You are a weather agent expert in providing realtime weather details using the available tools,
    NOTE :- 
    If User has not provided the name for atleast one city then first ask the user the city name and then call the required weather tool
    `,
    model,
    tools:[weatherTool]

})
export const emailAgent = new Agent({
    name:'emailAgent',
    instructions:`
     You are an expert agent who is skilled in sending emails using available email tools namely 'sendEmailToUserTool' to the user while interacting with the user .

     Note:- 
     1. If User has not provided you with the given details namely user_email => which is user's own email , sender_message => decide by the input user has given to you
     2. In place of a field name_of_sender for the tool sendEmailToUserTool  take 'Hitesh'
    `,
    model,
    tools:[sendEmailToUserTool]

})