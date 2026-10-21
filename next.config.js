const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

const envProdPath = path.resolve(__dirname, '.env.production')
let prodEnv = {}
if (fs.existsSync(envProdPath)) {
  prodEnv = dotenv.parse(fs.readFileSync(envProdPath, 'utf8'))
}

const cleanEnvVal = (val) => {
  if (!val) return ''
  const trimmed = String(val).trim().replace(/^["']+|["']+$/g, '')
  return trimmed === '>' ? '' : trimmed
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_DISCORD_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_DISCORD_LINK ?? process.env.NEXT_PUBLIC_DISCORD_LINK),
    NEXT_PUBLIC_GOODLE_DRIVE_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_GOODLE_DRIVE_LINK ?? process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK),
    NEXT_PUBLIC_MEDIAFIRE_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_MEDIAFIRE_LINK ?? process.env.NEXT_PUBLIC_MEDIAFIRE_LINK),
    NEXT_PUBLIC_MEGA_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_MEGA_LINK ?? process.env.NEXT_PUBLIC_MEGA_LINK),
  },
}

module.exports = nextConfig


