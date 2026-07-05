import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import type {Request,Response} from 'express'
import {OpenAI} from 'openai'
import {run} from '@openai/agents'
import type {Agent} from '@openai/agents' 
import {hiteshAgent} from './agents/hitesh/agent.ts'
import {HITESH_SIR_SYSTEM_PROMPT} from './agents/hitesh/Persona.ts'
import {hiteshGuardRailAgent} from './agents/hitesh/guardrailAgent.ts'
import {piyushAgent} from './agents/piyush/agent.ts'
import {PIYUSH_SIR_SYSTEM_PROMPT} from './agents/piyush/Persona.ts'
import {piyushGuardRailAgent} from './agents/piyush/guardrailAgent.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = new OpenAI()

const app = express()
const CLIENT_BASE_URL:string = process.env?.CLIENT_BASE_URL!

app.use(cors({
    origin:[CLIENT_BASE_URL,"https://personic.mehularora.dev"],
    credentials:true,
}))

app.use(express.json())
app.use(express.urlencoded())

app.use(cookieParser())

async function getConverstaionId():Promise<string>{
 const {id} = await client.conversations.create({})
 return id
}

async function main(
    personiqAgent:Agent,
    guardRailAgent:Agent<any,any>,
    SYSTEM:string,
    res:Response,
    id:string,
    userInput:string){
    const guardRailResponse = await run(guardRailAgent,[
        {
        role:"user",
        content:userInput
       }
])

if(!guardRailResponse?.finalOutput?.isValidQuery){
throw new Error(`Invalid Querry , due to Reason => ${guardRailResponse?.finalOutput?.reason}`)
}
    
 const response = await run(personiqAgent,[
        {
        role:"system",
        content:SYSTEM
       },
        {
        role:"user",
        content:userInput
       }
],{
    stream:true,
    conversationId:id
})

const streamOutput = response.toTextStream()

for await (const chunk of streamOutput){
    res.write(chunk)
}
res.end()

}

app.post('/api/post',async (req:Request,res:Response) => {
    console.log(CLIENT_BASE_URL)

    const {message,persona} = req.body

           if(!message || !persona){
            throw new Error('invalid message or persona')
           }
          let personaId_1 = null
           switch (persona) {
            case "hitesh":{
                personaId_1 = req.cookies?.hiteshAgentId_1
                 console.log(personaId_1)
                if(!personaId_1){
              const id = await getConverstaionId()
                res.cookie("hiteshAgentId_1",id,{
                    httpOnly:true,
                    sameSite:'lax',
                    secure:false,
                    maxAge: 30 * 1000 // 30 second
               })

                  return await main(
                    hiteshAgent,
                    hiteshGuardRailAgent,
                    HITESH_SIR_SYSTEM_PROMPT,
                    res,id,message)
           }

                return await main(
                hiteshAgent,
                hiteshGuardRailAgent,
                HITESH_SIR_SYSTEM_PROMPT,
                res,personaId_1,message)

            }
            case "piyush":{
                personaId_1 = req.cookies?.piyushAgentId_1
                 console.log(personaId_1)
                    if(!personaId_1){
                const id = await getConverstaionId()
                    res.cookie("piyushAgentId_1",id,{
                    httpOnly:true,
                    sameSite:'lax',
                    secure:false,
                    maxAge: 30 * 1000 // 30 second
               })

                return await main(
                    piyushAgent,
                    piyushGuardRailAgent,
                    PIYUSH_SIR_SYSTEM_PROMPT,
                    res,id,message)

           }
              return await main(
                piyushAgent,
                piyushGuardRailAgent,
                PIYUSH_SIR_SYSTEM_PROMPT,
                res,personaId_1,message)
            }
           }

})

export default app;
