import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import type { Request, Response } from 'express'
import { OpenAI } from 'openai'
import { run } from '@openai/agents'
import type { Agent } from '@openai/agents'
import { OpenAIChatCompletionsModel } from '@openai/agents-openai'
import rateLimit from 'express-rate-limit'

import { hiteshAgent } from './agents/hitesh/agent.ts'
import { HITESH_SIR_SYSTEM_PROMPT } from './agents/hitesh/Persona.ts'
import { getHiteshGuardRailAgent } from './agents/hitesh/guardrailAgent.ts'
import { piyushAgent } from './agents/piyush/agent.ts'
import { PIYUSH_SIR_SYSTEM_PROMPT } from './agents/piyush/Persona.ts'
import { getPiyushGuardRailAgent } from './agents/piyush/guardrailAgent.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

const app = express()
const CLIENT_BASE_URL: string = process.env?.CLIENT_BASE_URL!

const BYOK_COOKIE = 'personic_byok_key'
const BYOK_FLAG_COOKIE = 'personic_byok_active'
const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000

const byokRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many BYOK requests, please try again later.' },
})

const allowedOrigins = [
  CLIENT_BASE_URL,
  "https://personic.mehularora.dev",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true)
    }
    return callback(null, true)
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

function getEffectiveApiKey(userApiKey?: string): string {
  const key = userApiKey || process.env.OPENAI_API_KEY || ''
  return key.trim()
}

function scopeAgentToUserKey<T extends Agent<any, any>>(agent: T, apiKey: string | undefined): T {
  const effectiveKey = getEffectiveApiKey(apiKey)
  if (!effectiveKey) {
    throw new Error('NO_API_KEY: No OpenAI API key provided. Please save your API key using the BYOK button in the header.')
  }
  const scopedClient = new OpenAI({ apiKey: effectiveKey })
  return agent.clone({
    model: new OpenAIChatCompletionsModel(scopedClient, 'gpt-4o-mini'),
  }) as T
}

async function getConverstaionId(apiKey?: string): Promise<string> {
  const effectiveKey = getEffectiveApiKey(apiKey)
  if (!effectiveKey) {
    throw new Error('NO_API_KEY: No OpenAI API key provided. Please save your API key using the BYOK button in the header.')
  }
  const c = new OpenAI({ apiKey: effectiveKey })
  const { id } = await c.conversations.create({})
  return id
}

async function main(
  personiqAgent: Agent,
  guardRailAgent: Agent<any, any>,
  SYSTEM: string,
  res: Response,
  id: string,
  userInput: string,
  userApiKey: string | undefined,
) {
  const scopedGuardRail = scopeAgentToUserKey(guardRailAgent, userApiKey)
  const scopedAgent = scopeAgentToUserKey(personiqAgent, userApiKey)

  const guardRailResponse = await run(scopedGuardRail, [
    {
      role: "user",
      content: userInput,
    },
  ])

  if (!guardRailResponse?.finalOutput?.isValidQuery) {
    throw new Error(`Invalid Querry , due to Reason => ${guardRailResponse?.finalOutput?.reason}`)
  }

  const response = await run(scopedAgent, [
    {
      role: "system",
      content: SYSTEM,
    },
    {
      role: "user",
      content: userInput,
    },
  ], {
    stream: true,
    conversationId: id,
  })

  const streamOutput = response.toTextStream()

  for await (const chunk of streamOutput) {
    res.write(chunk)
  }
  res.end()
}

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ health: 'ok' })
})

app.get('/api/byok/status', (req: Request, res: Response) => {
  res.status(200).json({ hasKey: Boolean(req.cookies?.[BYOK_COOKIE]) })
})

app.post('/api/byok', byokRateLimiter, async (req: Request, res: Response) => {
  const { apiKey } = req.body ?? {}

  if (typeof apiKey !== 'string' || !apiKey.trim()) {
    return res.status(400).json({ error: 'API key is required' })
  }

  const trimmedKey = apiKey.trim()

  if (!/^sk-[A-Za-z0-9_-]{16,}$/.test(trimmedKey)) {
    return res.status(400).json({ error: "That doesn't look like a valid OpenAI API key" })
  }

  try {
    const testClient = new OpenAI({ apiKey: trimmedKey })
    await testClient.models.list()
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid OpenAI API key. Authentication with OpenAI failed.' })
  }

  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: TEN_YEARS_MS,
    path: '/',
  }

  res.cookie(BYOK_COOKIE, trimmedKey, cookieOpts)
  res.cookie(BYOK_FLAG_COOKIE, '1', { ...cookieOpts, httpOnly: false })

  return res.status(200).json({ success: true })
})

app.post('/api/deletekey', byokRateLimiter, (req: Request, res: Response) => {
  const clearOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
  }
  res.clearCookie(BYOK_COOKIE, clearOpts)
  res.clearCookie(BYOK_FLAG_COOKIE, { ...clearOpts, httpOnly: false })
  return res.status(200).json({ success: true })
})

app.post('/api/post', async (req: Request, res: Response) => {
  try {
    const { message, persona } = req.body
    const userApiKey = req.cookies?.[BYOK_COOKIE]

    console.log(`[POST /api/post] BYOK cookie present: ${Boolean(userApiKey)}`)

    if (!message || !persona) {
      throw new Error('invalid message or persona')
    }
    let personaId_1 = null
    switch (persona) {
      case "hitesh": {
        personaId_1 = req.cookies?.hiteshAgentId_1
        const guardRail = getHiteshGuardRailAgent(userApiKey)
        if (!personaId_1) {
          const id = await getConverstaionId(userApiKey)
          res.cookie("hiteshAgentId_1", id, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 30 * 1000,
          })

          return await main(
            hiteshAgent,
            guardRail,
            HITESH_SIR_SYSTEM_PROMPT,
            res, id, message, userApiKey)
        }

        return await main(
          hiteshAgent,
          guardRail,
          HITESH_SIR_SYSTEM_PROMPT,
          res, personaId_1, message, userApiKey)
      }
      case "piyush": {
        personaId_1 = req.cookies?.piyushAgentId_1
        const guardRail = getPiyushGuardRailAgent(userApiKey)
        if (!personaId_1) {
          const id = await getConverstaionId(userApiKey)
          res.cookie("piyushAgentId_1", id, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 30 * 1000,
          })

          return await main(
            piyushAgent,
            guardRail,
            PIYUSH_SIR_SYSTEM_PROMPT,
            res, id, message, userApiKey)
        }
        return await main(
          piyushAgent,
          guardRail,
          PIYUSH_SIR_SYSTEM_PROMPT,
          res, personaId_1, message, userApiKey)
      }
    }
  } catch (error: any) {
    console.error("API POST error:", error)
    const errorMsg = error?.message || ''
    const status = error?.status || error?.statusCode || error?.response?.status

    if (errorMsg.includes('NO_API_KEY') || status === 429 || status === 401 || errorMsg.includes('429') || errorMsg.includes('401') || errorMsg.includes('quota') || errorMsg.includes('billing') || errorMsg.includes('limit') || errorMsg.includes('API key')) {
      res.status(401).send("are bhai pehele valid key use karo phir baat karenge .")
      return
    }
    res.status(500).send(errorMsg || "Internal Server Error")
  }
})

export default app
