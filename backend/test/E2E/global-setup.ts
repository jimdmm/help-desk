import { execSync } from 'node:child_process'
import { generateKeyPairSync } from 'node:crypto'
import { resolve } from 'node:path'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { RedisContainer, type StartedRedisContainer } from '@testcontainers/redis'

let postgres: StartedPostgreSqlContainer
let redis: StartedRedisContainer

const backendDir = resolve(process.cwd())

export async function setup() {
  console.log('\n[E2E] Starting test containers...')

  ;[postgres, redis] = await Promise.all([
    new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('helpdesk_test')
      .withUsername('test')
      .withPassword('test')
      .start(),
    new RedisContainer('redis:7-alpine').start(),
  ])

  process.env['DATABASE_URL'] = postgres.getConnectionUri()
  process.env['REDIS_HOST'] = redis.getHost()
  process.env['REDIS_PORT'] = String(redis.getMappedPort(6379))
  process.env['REDIS_DB'] = '0'

  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  process.env['JWT_PRIVATE_KEY'] = Buffer.from(
    privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  ).toString('base64')
  process.env['JWT_PUBLIC_KEY'] = Buffer.from(
    publicKey.export({ type: 'spki', format: 'pem' }).toString(),
  ).toString('base64')

  process.env['SUPABASE_URL'] = 'https://fake.supabase.co'
  process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'fake-service-role-key'
  process.env['SUPABASE_STORAGE_BUCKET'] = 'fake-bucket'
  process.env['PORT'] = '0'

  console.log('[E2E] Pushing Prisma schema to test database...')
  execSync('pnpm exec prisma db push', {
    env: process.env,
    cwd: backendDir,
    stdio: 'pipe',
  })

  console.log('[E2E] Containers ready.')
}

export async function teardown() {
  console.log('\n[E2E] Stopping test containers...')
  await Promise.all([postgres?.stop(), redis?.stop()])
}
