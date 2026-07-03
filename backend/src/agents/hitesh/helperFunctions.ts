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

      subject: "Hitesh Sir's Assistant",

      html: `
<div style="
  background-color:#0f172a;
  padding:40px 20px;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:650px;
    margin:auto;
    background:linear-gradient(145deg,#111827,#1e293b);
    border-radius:20px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,0.08);
    box-shadow:0 10px 40px rgba(0,0,0,0.35);
  ">

    <!-- HEADER -->
    <div style="
      padding:35px 30px;
      background:linear-gradient(135deg,#7c3aed,#4f46e5);
      text-align:center;
    ">
      <h1 style="
        margin:0;
        color:white;
        font-size:32px;
        font-weight:700;
        letter-spacing:1px;
      ">
        AI Assistant Notification
      </h1>

      <p style="
        margin-top:12px;
        color:rgba(255,255,255,0.85);
        font-size:15px;
        line-height:1.6;
      ">
        A new interaction has been initiated through your AI assistant platform.
      </p>
    </div>

    <!-- BODY -->
    <div style="
      padding:35px 30px;
      background-color:#111827;
    ">

      <!-- USER DETAILS -->
      <div style="
        background-color:#1e293b;
        border:1px solid rgba(255,255,255,0.08);
        border-radius:16px;
        padding:24px;
        margin-bottom:25px;
      ">

        <h2 style="
          color:#c4b5fd;
          margin-top:0;
          margin-bottom:20px;
          font-size:20px;
        ">
          User Information
        </h2>

        <div style="margin-bottom:14px;">
          <span style="
            color:#94a3b8;
            font-size:14px;
            display:block;
            margin-bottom:4px;
          ">
            Name
          </span>

          <span style="
            color:white;
            font-size:16px;
            font-weight:600;
          ">
            ${name}
          </span>
        </div>

        <div>
          <span style="
            color:#94a3b8;
            font-size:14px;
            display:block;
            margin-bottom:4px;
          ">
            Email Address
          </span>

          <span style="
            color:white;
            font-size:16px;
            font-weight:600;
          ">
            ${email}
          </span>
        </div>

      </div>

      <!-- MESSAGE -->
      <div style="
        background-color:#1e293b;
        border:1px solid rgba(255,255,255,0.08);
        border-radius:16px;
        padding:24px;
      ">

        <h2 style="
          color:#c4b5fd;
          margin-top:0;
          margin-bottom:20px;
          font-size:20px;
        ">
          User Message
        </h2>

        <div style="
          color:#e2e8f0;
          font-size:15px;
          line-height:1.9;
          white-space:pre-wrap;
        ">
          ${message}
        </div>

      </div>

    </div>

    <!-- FOOTER -->
    <div style="
      padding:22px;
      text-align:center;
      background-color:#0f172a;
      border-top:1px solid rgba(255,255,255,0.06);
    ">

      <p style="
        margin:0;
        color:#94a3b8;
        font-size:13px;
        line-height:1.7;
      ">
        Sent via your AI Assistant System • Powered by Mehul Arora
      </p>

    </div>

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

