import {Agent,run} from '@openai/agents'
import readline from 'readline'
import {OpenAI} from 'openai'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
// import
//  {
//     weatherAgent,
//     emailAgent,
//     youtubeVideoSearchingAgent,
//     youtubePlaylistSearchingAgent
// } from './agenticTools.ts'
import {mainAgentInstruction} from './instruction.ts'
import {guardRailAgent} from './guardrailAgent.ts'
import {SYSTEM} from './Persona.ts'
import{
    weatherTool,
    sendEmailToUserTool,
    youtubeVideoSearchingTool,
    youtubePlaylistSearchingTool
} from './subTools.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const client = new OpenAI()

const {id} = await client.conversations.create({})

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})
const model = 'gpt-4o-mini'


const hiteshAgent = new Agent({
    name:`Hitesh's Agent`,
    model,
    instructions: mainAgentInstruction,
    tools:[
    weatherTool,
    sendEmailToUserTool,
    youtubeVideoSearchingTool,
    youtubePlaylistSearchingTool
    ]
})


while(true){
    const question:string = await askQuestion("Ask Question: ")
    if(question.toLowerCase() === 'exit'){
        console.log('exiting...')
        break;
    }

  process.stdout.write('ChatBot: ')
  try {
    await main(question)
  } catch (error) {
    console.log(error)
  }
  console.log('\n')

}
rl.close()

async function main(question:string){

    const guardRailResponse = await run(guardRailAgent,[
        {
        role:"user",
        content:question
       }
])

if(!guardRailResponse?.finalOutput?.isValidQuery){
throw new Error(`Invalid Querry , due to Reason => ${guardRailResponse?.finalOutput?.reason}`)
}
    
 const response = await run(hiteshAgent,[
        {
        role:"system",
        content:SYSTEM
       },
        {
        role:"user",
        content:question
       }
],{
    stream:true,
    conversationId:id
})

const streamOutput = response.toTextStream()

for await (const chunk of streamOutput){
    process.stdout.write(chunk)
}

}

async function askQuestion(querry:string = ''):Promise<string>{
  return new Promise((resolve) => {
    rl.question(querry,(answer) => {
        resolve(answer)
    })
  })
}
