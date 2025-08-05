import { PrismaClient, Group } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const company1 = await prisma.company.upsert({
    where: { name: 'Adriatic.hr' },
    update: {},
    create: {
      name: 'Adriatic.hr',
      logoUrl: 'https://www.svgrepo.com/show/535115/alien.svg',
      group: Group.A,
    },
  });

  console.log({ company1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
