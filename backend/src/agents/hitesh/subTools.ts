import {tool} from '@openai/agents'
import {z} from 'zod'
import axios from 'axios'
import {Resend} from 'resend'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const resend = new Resend(process.env.RESEND_API_KEY);


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
  description:"this tool will send an email to the user via Resend service provider",
  parameters:z.object({
    user_email:z.string().email().max(100).min(11).describe('email of the user'),
    name_of_sender:z.string().describe('sender name'),
    sender_message:z.string().describe('message by sender')
  }),
  execute:async function({sender_message,name_of_sender,user_email}){
     const response = await sendEmailToMehul(name_of_sender,user_email,sender_message)
   if(response?.success){
    return 'email sended successfully' // note tools main return karna is must as us return value ko dekh ke hi ai predict karta hain ki kaam hua ya nahin as vo sirf function call karta hain kaam hua ya nahin ye use return statement se pata chalta hain 
   }
    return `Failed to send email: ${response.error}`
  
  }
})





const sendEmailToMehul = async (name:string, email:string, message:string) => {
  try {
    const response = await resend.emails.send({
      from: "contact@mehularora.dev",
      // AFTER DOMAIN VERIFICATION USE:
      // from: "Portfolio <contact@mehularora.dev>",

      to: email,

      replyTo: "mehularora506@gmail.com",

      subject: "Portfolio Interaction",

      html: `
      <div style="
        max-width: 600px;
        margin: auto;
        padding: 30px;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        border-radius: 12px;
        border: 1px solid #ddd;
      ">
        <h1 style="color: #7c3aed; text-align: center; margin-bottom: 30px;">
          New Portfolio Message
        </h1>

        <div style="
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        ">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>

        <div style="
          background-color: white;
          padding: 20px;
          border-radius: 10px;
        ">
          <h2 style="color: #7c3aed;">Message</h2>
          <p style="
            white-space: pre-wrap;
            line-height: 1.7;
          ">
            ${message}
          </p>
        </div>
      </div>
      `,
    });

    if(response.error){
      throw response.error
    }

      return {
      success:true,
      data:response
    }

  } catch (err) {

    console.log("EMAIL ERROR =>", err);

    return {
      success:false,
      error:err instanceof Error ?  err.message:'unknown error'
    }
  }
};