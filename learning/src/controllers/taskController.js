const prisma = require('../config/prisma');

const getTasks = async (req, res) => {
    const tasks = await prisma.task.findMany({
        where: { userId: req.userId }
    });
    res.json(tasks);
};

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        console.log("📅 dueDate reçue :", dueDate);

        if (!title) {
            return res.status(400).json({ error: 'Le titre est requis' });
        }

        const task = await prisma.task.create({
            data: { 
                title, 
                description, 
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.userId
            }
        });
        res.status(201).json(task);
    } catch (error) {
        console.log("❌ ERREUR :", error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params
    const { title, description, status, dueDate } = req.body

    const task = await prisma.task.updateMany({
        where: { id: Number(id), userId: req.userId },
        data: { title, description, status, dueDate: dueDate ? new Date(dueDate) : null }
    })

    if (task.count === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' })
    }

    res.json({ message: 'Tâche modifiée' })
}

const deleteTask = async (req, res) => {
    const { id } = req.params;

    const task = await prisma.task.deleteMany({
        where: { id: Number(id), userId: req.userId }
    });

    if (task.count === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };