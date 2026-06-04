import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] })

const HASH_SALT = 8

async function seedAdmin() {
  const existing = await prisma.admin.findUnique({
    where: { email: 'admin@helpdesk.com' },
  })

  if (existing) {
    console.log('Admin already exists, skipping.')
    return
  }

  await prisma.admin.create({
    data: {
      name: 'Administrador',
      email: 'admin@helpdesk.com',
      password: await hash('admin123', HASH_SALT),
    },
  })

  console.log('Admin created.')
}

async function seedTechnicians() {
  const technicians = [
    {
      name: 'Carlos Silva',
      email: 'carlos@helpdesk.com',
      password: 'tecnico123',
      availability: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
    {
      name: 'Ana Souza',
      email: 'ana@helpdesk.com',
      password: 'tecnico123',
      availability: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    },
    {
      name: 'Rafael Lima',
      email: 'rafael@helpdesk.com',
      password: 'tecnico123',
      availability: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
  ]

  for (const data of technicians) {
    const existing = await prisma.technician.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      console.log(`Technician ${data.email} already exists, skipping.`)
      continue
    }

    await prisma.technician.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hash(data.password, HASH_SALT),
        availability: data.availability,
      },
    })

    console.log(`Technician ${data.name} created.`)
  }
}

async function seedServices() {
  const count = await prisma.service.count()

  if (count > 0) {
    console.log('Services already exist, skipping.')
    return
  }

  const services = [
    { name: 'Formatação e Reinstalação do Sistema', price: 150.0 },
    { name: 'Limpeza Interna e Manutenção', price: 80.0 },
    { name: 'Substituição de HD por SSD', price: 200.0 },
    { name: 'Remoção de Vírus e Malware', price: 100.0 },
    { name: 'Configuração de Rede e Wi-Fi', price: 120.0 },
    { name: 'Reparo de Tela', price: 250.0 },
  ]

  await prisma.service.createMany({ data: services })

  console.log(`${services.length} services created.`)
}

async function main() {
  console.log('Starting seed...')
  await seedAdmin()
  await seedTechnicians()
  await seedServices()
  console.log('Seed completed.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
