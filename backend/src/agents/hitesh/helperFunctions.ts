import axios from 'axios'
import {Resend} from 'resend'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const API_KEY = process.env.YOUTUBE_API_KEY;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function searchVideos(q: string,videos: number,channelId?: string) { // optional parameter at the end

  const params: any = {
    part: "snippet",
    q,
    type: "video",
    maxResults: videos,
    key: API_KEY,
  };

  // only add channelId if provided
  if (channelId?.trim()) {
    params.channelId = channelId;
  }

  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",{ params });

  const {data} = response;

  return data['items'].map((obj:any,i:number) => `https://www.youtube.com/watch?v=${obj['id']['videoId']}`)

}

export async function searchPlaylists(q: string,playlists: number,channelId?: string) { // optional parameter at the end

  const params: any = {
    part: "snippet",
    q,
    type: "playlist",
    maxResults: playlists,
    key: API_KEY,
  };

  // only add channelId if provided
  if (channelId?.trim()) {
    params.channelId = channelId;
  }

  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",{ params });

  const {data} = response;

  return data['items'].map((obj:any,i:number) => `https://www.youtube.com/playlist?list=${obj['id']['playlistId']}`)

}


export const sendEmailToMehul = async (name:string, email:string, message:string) => {
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

