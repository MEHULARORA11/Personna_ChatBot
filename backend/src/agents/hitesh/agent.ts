import {Agent,run} from '@openai/agents'
import readline from 'readline'
import {OpenAI} from 'openai'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {weatherAgent,emailAgent,youtubeVideoSearchingAgent,youtubePlaylistSearchingAgent} from './agenticTools.ts'
import {mainAgentInstruction} from './instruction.ts'

const client = new OpenAI()

const {id} = await client.conversations.create({})

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

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
        weatherAgent.asTool({
        toolName:'weatherAgent',
        toolDescription:'fetches realtime weather details'
    }),
    emailAgent.asTool({
        toolName:'emailAgent',
        toolDescription:`This Tool helps in sending emails`
    }),
    youtubeVideoSearchingAgent.asTool({
        toolName:'youtubeVideoSearchingAgent',
        toolDescription:`This tool will help the user to fetch youtube videos of hitesh and piyush`
    }),
    youtubePlaylistSearchingAgent.asTool({
        toolName:'youtubePlaylistSearchingAgent',
        toolDescription:`This tool will help the user to fetch youtube playlist of hitesh and piyush`
    }),
]
})


while(true){
    const question:string = await askQuestion("Ask Question: ")
    if(question.toLowerCase() === 'exit'){
        console.log('exiting...')
        break;
    }

  process.stdout.write('ChatBot: ')
  await main(question)
  console.log('\n')

}
rl.close()

async function main(question:string){
    
 const response = await run(hiteshAgent,[
    {
    role:'system',
    content:'you are a helpful assistant who help user in every possible way'
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
