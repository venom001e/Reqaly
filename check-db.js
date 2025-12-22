const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database...');
    
    const users = await prisma.user.findMany();
    console.log('Users:', users.length);
    
    const workspaces = await prisma.workspace.findMany();
    console.log('Workspaces:', workspaces.length);
    
    const collections = await prisma.collection.findMany();
    console.log('Collections:', collections.length);
    
    if (workspaces.length > 0) {
      console.log('Workspace details:', workspaces);
    }
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();