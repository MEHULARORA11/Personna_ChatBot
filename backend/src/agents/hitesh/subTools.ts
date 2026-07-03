import {tool} from '@openai/agents'
import {z} from 'zod'
import axios from 'axios'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import {sendEmailToMehul,searchVideos,searchPlaylists} from './helperFunctions.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const HITESH_SIR_CHANNEL_ID = process.env.HITESH_SIR_CHANNEL_ID;
const PIYUSH_SIR_CHANNEL_ID = process.env.PIYUSH_SIR_CHANNEL_ID;

export const youtubeVideoSearchingTool = tool({
    name:'youtubeVideoSearchingTool',
    description:'This tool helps in searching for the youtube videos',
    parameters:z.object({
        query:z.string().trim().describe('name of the search query , searched by user'),
        videos:z.number().describe('amount of videos the user wants to fetch').default(1),
        teacherName:z.string().trim().optional().describe('name of the teacher')
    }),
    execute:async ({query,videos,teacherName}) => {
        if(teacherName){
            return teacherName.toLowerCase() === 'hitesh'? 
            await searchVideos(query,videos,HITESH_SIR_CHANNEL_ID):
            await searchVideos(query,videos,PIYUSH_SIR_CHANNEL_ID)
        }
     return await searchVideos(query,videos)
    },
})
export const youtubePlaylistSearchingTool = tool({
    name:'youtubePlaylistSearchingTool',
    description:'This tool helps in searching for the youtube playlist',
    parameters:z.object({
        query:z.string().trim().describe('name of the search query , searched by user'),
        playlists:z.number().describe('amount of playlists the user wants to fetch').default(1),
        teacherName:z.string().trim().optional().describe('name of the teacher')
    }),
    execute:async ({query,playlists,teacherName}) => {
        if(teacherName){
            return teacherName.toLowerCase() === 'hitesh'? 
            await searchPlaylists(query,playlists,HITESH_SIR_CHANNEL_ID):
            await searchPlaylists(query,playlists,PIYUSH_SIR_CHANNEL_ID)
        }
     return await searchPlaylists(query,playlists)
    },
})


export const weatherTool = tool({
    name:'weatherTool',
    description:'This tool Provide realtime weather details of the provided city',
    parameters:z.object({
        city:z.string().describe('name of the city'),
    }),
    execute:async ({city}) => {
     const result = await axios.get(`https://wttr.in/${city.toLowerCase()}?format=%C+%t`,{
        responseType:'json'
     })
     return result.data

    },
})

export const sendEmailToUserTool = tool({
  name:"send_email_to_user",
  description:"Send an email to the user using Resend",
  
  parameters:z.object({
    user_email:z.string().email().max(100).min(11).describe('email of the user'),
    name_of_sender:z.string().describe('sender name'),
    sender_message:z.string().describe('message by sender')
  }),

  execute:async function({
    sender_message,
    name_of_sender,
    user_email
  }) {

    const response = await sendEmailToMehul(
      name_of_sender,
      user_email,
      sender_message
    )

    if(response.success){
      return {
        success:true,
        message:"Email sent successfully"
      }
    }

    return {
      success:false,
      error:response.error || "Unknown email error"
    }
  }
})


