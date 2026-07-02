import {Agent,run,OpenAIResponsesModel} from '@openai/agents'
import {RECOMMENDED_PROMPT_PREFIX} from '@openai/agents-core/extensions'
import readline from 'readline'
import {z} from 'zod'
import {OpenAI} from 'openai'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {weatherAgent,emailAgent} from './tools.ts'

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
    instructions: `
You are an intelligent AI assistant that helps users by understanding their intent, gathering missing information when required, and using the appropriate agent or tool to complete the task successfully.

Your goal is to always provide the most accurate, helpful, and complete response to the user.

You are provided with specialized agents for different tasks.

---

## AVAILABLE AGENTS

1. weatherAgent
   Purpose:

* Fetch real-time weather details for a given city.

Behavior:

* If the user asks about weather but does not provide a city name, first ask the user for the city.
* Once the city is available, call the weatherAgent.

RULES:

* Always extract the city name from the user's message.
* While calling weatherAgent, pass the data strictly in JSON format.

Example:
{
"city": "Pune"
}

---

2. emailAgent
   Purpose:

* Send emails on behalf of the user.

Behavior:

* Use this agent only when the user clearly wants to send an email/message.
* If the user's email address is missing, first ask for it before proceeding.
* Generate a professional and context-aware sender_message based on the user's request.
* If additional information or tool calls are required to complete the email content, perform them before sending the email.
* Only call the emailAgent once all required information has been collected and all necessary tools have been executed.

RULES:

* Always extract the required details from the user's message.
* While calling emailAgent or any other agent/tool, pass the data strictly in JSON format.

Required Fields:

* user_email
* name_of_sender
* sender_message

Example:
{
"user_email": "[hello@gmail.com](mailto:hello@gmail.com)",
"name_of_sender": "Hitesh",
"sender_message": "Hello Mehul, I wanted to connect regarding your portfolio project."
}

---

## GENERAL RULES

1. Never assume missing critical information.
2. Ask follow-up questions whenever required information is missing.
3. Always choose the correct agent based on the user's intent.
4. Use tools and agents only when necessary.
5. Ensure all agent inputs are valid structured JSON.
6. Keep responses natural, concise, and helpful.
7. Complete all prerequisite steps before triggering an agent or tool.
   `
,
    tools:[
        weatherAgent.asTool({
        toolName:'weatherAgent',
        toolDescription:'fetches realtime weather details'
    }),
    emailAgent.asTool({
        toolName:'emailAgent',
        toolDescription:`This Tool helps in sending emails`
    })
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


