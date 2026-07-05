import Application from './app.ts'
import http from 'node:http'
import 'dotenv/config'

const PORT = process.env?.PORT

async function main(){
    const server = http.createServer(Application)
    server.listen(PORT,() => {
        console.log(`Server is running on Port ${PORT}`);
    })
}

await main()


