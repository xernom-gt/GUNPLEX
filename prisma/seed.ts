import prisma from '../src/lib/prisma'

async function main() {
  const hg = await prisma.category.upsert({
    where: { name: 'HG' },
    update: {},
    create: { name: 'HG' },
  })

  const mg = await prisma.category.upsert({
    where: { name: 'MG' },
    update: {},
    create: { name: 'MG' },
  })

  const pg = await prisma.category.upsert({
    where: { name: 'PG' },
    update: {},
    create: { name: 'PG' },
  })

  await prisma.product.createMany({
    data: [
      { name: 'HG RX-78-2 Gundam', price: 150000, quantity: 15, categoryId: hg.id },
      { name: 'HG Zaku II', price: 160000, quantity: 4, categoryId: hg.id },
      { name: 'MG Strike Freedom', price: 750000, quantity: 8, categoryId: mg.id },
      { name: 'MG Barbatos', price: 650000, quantity: 12, categoryId: mg.id },
      { name: 'PG Unleashed RX-78-2', price: 3500000, quantity: 2, categoryId: pg.id },
    ],
  })

  await prisma.user.upsert({
    where: { email: 'admin@gunplaos.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@gunplaos.com', role: 'admin' },
  })
  await prisma.user.upsert({
    where: { email: 'azkia@gunplaos.com' },
    update: {},
    create: { name: 'Azkia', email: 'azkia@gunplaos.com', role: 'staff' },
  })
  await prisma.user.upsert({
    where: { email: 'reza@gunplaos.com' },
    update: {},
    create: { name: 'Reza', email: 'reza@gunplaos.com', role: 'staff' },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
