import {OpenAI} from 'openai'

const client = new OpenAI()

const abusivePatterns = [
  /b[i1][t+]?ch[e3]r[s$]?/i,
  /b[i1][t+]?ch[e3][s$]/i,
  /b[i1][t+]?ch[i1]ng?/i,
  /b[l1][o0]wj[o0]b[s$]?/i,
  /c[l1][i1][t+]/i,

  /^(c|k|ck|q)[o0](c|k|ck|q)[s$]?$/i,
  /(c|k|ck|q)[o0](c|k|ck|q)[s$]?u/i,
  /(c|k|ck|q)[o0](c|k|ck|q)[s$]?u(c|k|ck|q)[e3]d/i,
  /(c|k|ck|q)[o0](c|k|ck|q)[s$]?u(c|k|ck|q)[e3]r/i,
  /(c|k|ck|q)[o0](c|k|ck|q)[s$]?u(c|k|ck|q)[i1]ng/i,
  /(c|k|ck|q)[o0](c|k|ck|q)[s$]?u(c|k|ck|q)[s$]/i,

  /^cum[s$]?$/i,
  /cumm??[e3]r/i,
  /cumm?[i1]ngcock/i,
  /(c|k|ck|q)um[s$]h[o0][t+]/i,

  /(c|k|ck|q)un[i1][l1][i1]ngu[s$]/i,
  /(c|k|ck|q)un[i1][l1][l1][i1]ngu[s$]/i,
  /(c|k|ck|q)unn[i1][l1][i1]ngu[s$]/i,

  /(c|k|ck|q)un[t+][s$]?/i,
  /(c|k|ck|q)un[t+][l1][i1](c|k|ck|q)/i,
  /(c|k|ck|q)un[t+][l1][i1](c|k|ck|q)[e3]r/i,
  /(c|k|ck|q)un[t+][l1][i1](c|k|ck|q)[i1]ng/i,

  /cyb[e3]r(ph|f)u(c|k|ck|q)/i,
  /d[a@]mn/i,
  /d[i1]ck/i,
  /d[i1][l1]d[o0]/i,
  /d[i1][l1]d[o0][s$]/i,

  /d[i1]n(c|k|ck|q)/i,
  /d[i1]n(c|k|ck|q)[s$]/i,

  /[e3]j[a@]cu[l1]/i,

  /(ph|f)[a@]g[s$]?/i,
  /(ph|f)[a@]gg[i1]ng/i,
  /(ph|f)[a@]gg?[o0][t+][s$]?/i,
  /(ph|f)[a@]gg[s$]/i,

  /(ph|f)[e3][l1][l1]?[a@][t+][i1][o0]/i,

  /(ph|f)u(c|k|ck|q)/i,
  /(ph|f)u(c|k|ck|q)[s$]?/i,

  /g[a@]ngb[a@]ng[s$]?/i,
  /g[a@]ngb[a@]ng[e3]d/i,

  /g[a@]y/i,
  /h[o0]m?m[o0]/i,
  /h[o0]rny/i,

  /j[a@](c|k|ck|q)-?[o0](ph|f)(ph|f)?/i,
  /j[e3]rk-?[o0](ph|f)(ph|f)?/i,

  /j[i1][s$z][s$z]?m?/i,

  /[ck][o0]ndum[s$]?/i,

  /mast(e|ur)b(8|ait|ate)/i,

  /n+[i1]+[gq]+[e3]*r+[s$]*/i,

  /[o0]rg[a@][s$][i1]m[s$]?/i,
  /[o0]rg[a@][s$]m[s$]?/i,

  /p[e3]nn?[i1][s$]/i,

  /p[i1][s$][s$]/i,
  /p[i1][s$][s$][o0](ph|f)(ph|f)/i,

  /p[o0]rn/i,
  /p[o0]rn[o0][s$]?/i,
  /p[o0]rn[o0]gr[a@]phy/i,

  /pr[i1]ck[s$]?/i,

  /pu[s$][s$][i1][e3][s$]/i,
  /pu[s$][s$]y[s$]?/i,

  /[s$][e3]x/i,
  /[s$]h[i1][t+][s$]?/i,
  /[s$][l1]u[t+][s$]?/i,
  /[s$]mu[t+][s$]?/i,
  /[s$]punk[s$]?/i,

  /[t+]w[a@][t+][s$]?/i,

   // MC / BC
  /\bmc\b/i,
  /\bbc\b/i,
  /m+a+d+[ae]r+c+h?[o0]*d+/i,
  /m+a+d+r+c+h?[o0]*d+/i,
  /b+h+[ae]n+c+h?[o0]*d+/i,
  /b+[ae]h+n+c+h?[o0]*d+/i,

  // BSDK
  /b+h+[oa]?[s\$]*d+k/i,
  /b+[ae]h+n+k+[ae]?\s*l+[o0]*d+[ae]/i,
  /bsdk/i,

  // Chutiya
  /c+h+u+t+[i1y]+[ae]/i,
  /c+h+u+t+/i,

  // Gaandu / Gand
  /g+[ae]n+d+u+/i,
  /g+[ae]n+d+/i,
  /g+a+a+n+d+/i,

  // Lund
  /l+u+n+d+/i,
  /l+o+d+[uua]*/i,

  // Randi
  /r+a+n+d+[i1]/i,
  /r+a+n+d/i,
  /r+a+n+d/i,

  // Harami
  /h+a+r+a+m+[i1]/i,
  /haram/i,

  // Kaminey
  /k+a+m+[i1]n+[aey]+/i,

  // Chod
  /chod/i,

  // Kutta / Kamina
  /k+u+t+t+[ae]/i,
  /k+a+m+[i1]n+a+/i,

  // Teri maa / maa ki
  /m+a+a+\s*k+[i1]/i,
  /t+e+r+[i1]\s*m+a+a+/i,

  // Behen ke lode
  /b+[ae]h+n+\s*k+e+\s*l+[o0]*d+e+/i,

  // Betichod
  /b+e+t+[i1]+c+h?[o0]*d+/i,

  // Bakchod
  /b+a+k+c+h?[o0]*d+/i,

  // Lavde / lawde
  /l+[ae]v+d+e+/i,
  /l+a+w+d+e+/i,

  // Jhatu
  /j+h+a+t+u+/i,

  // Bhosdike
  /b+h+[o0]+s+d+[i1]k+e+/i,

  // Chu***
  /c+h+u+\*/i,

  // Misc common
  /m+u+t+h+/i,
  /t+a+t+t+e+/i,
  /c+h+a+k+k+e+/i,
  /h+i+j+r+a+/i
];

function normalizeText(text:string) {
  return text
    .toLowerCase()

    // leetspeak replacements
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[7]/g, "t")

    // remove spaces/symbols
    .replace(/[^a-z0-9]/gi, "")

    // collapse repeated chars
    .replace(/(.)\1+/g, "$1");
}

function containsAbuse(text:string) {
  return abusivePatterns.some((pattern) => pattern.test(text));
}

function containsNonEnglish(text:string) {
  return /[^\x00-\x7F]/.test(text);
}


async function isSafe(message:string){
  const moderation = await client.moderations.create({
    model:"omni-moderation-latest",
    input:message
  })

  return !moderation?.results[0]?.flagged
}

export async function isAbusive(userPrompt:string){
   
const isNonEnglish = containsNonEnglish(userPrompt)

const text  = normalizeText(userPrompt)

const isSafeMessage = await isSafe(userPrompt);


const abusiveNormalized =   containsAbuse(text)
const abusive =   containsAbuse(userPrompt)



if(!isSafeMessage || abusiveNormalized || abusive || isNonEnglish){
  return true
}
return false
}
