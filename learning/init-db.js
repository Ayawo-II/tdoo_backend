require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function init() {
  console.log('🔧 Nettoyage et recréation des tables...');
  
  try {
    // Désactiver les contraintes de clés étrangères
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
    
    // Supprimer les tables si elles existent
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS tasks;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS users;`);
    
    // Réactiver les contraintes
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
    
    // Créer la table users
    await prisma.$executeRawUnsafe(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(191) NOT NULL UNIQUE,
        password VARCHAR(191) NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      )
    `);
    
    // Créer la table tasks
    await prisma.$executeRawUnsafe(`
      CREATE TABLE tasks (
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
    
    console.log('✅ Tables users et tasks recréées avec succès !');
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  await prisma.$disconnect();
}

init();