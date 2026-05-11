require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function init() {
  console.log('🔧 Vérification/création des tables...');
  
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(191) NOT NULL UNIQUE,
        password VARCHAR(191) NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      )
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS taches (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(191) NOT NULL,
        description VARCHAR(191) NULL,
        status VARCHAR(191) NOT NULL DEFAULT 'pending',
        dueDate DATE NULL,
        userId INT NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('✅ Tables OK');
  } catch (error) {
    console.log('⚠️ Erreur (peut être normale si tables déjà créées):', error.message);
  }
  await prisma.$disconnect();
}

init();