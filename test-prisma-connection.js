const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const allNotes = await prisma.note.findMany();
    console.log(allNotes);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
