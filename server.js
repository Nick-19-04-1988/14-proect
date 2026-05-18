const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve production build

// In-memory database (for demo)
let items = [
    { id: 1, title: 'Item 1', description: 'First item' },
    { id: 2, title: 'Item 2', description: 'Second item' },
];

let nextId = 3;

// Contacts storage
let contacts = [];
let contactId = 1;

// Routes

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// GET /api/items/:id - Get single item
app.get('/api/items/:id', (req, res) => {
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

// POST /api/items - Create new item
app.post('/api/items', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newItem = {
        id: nextId++,
        title,
        description: description || '',
    };

    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT /api/items/:id - Update item
app.put('/api/items/:id', (req, res) => {
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const { title, description } = req.body;
    if (title) item.title = title;
    if (description !== undefined) item.description = description;

    res.json(item);
});

// DELETE /api/items/:id - Delete item
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex((i) => i.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = items.splice(index, 1);
    res.json(deletedItem[0]);
});

// POST /api/contacts - Submit contact form
app.post('/api/contacts', (req, res) => {
    const { name, email, phone, subject, message, terms } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            error: 'Name, email, subject, and message are required',
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!terms) {
        return res.status(400).json({
            error: 'You must agree to the terms and conditions',
        });
    }

    const newContact = {
        id: contactId++,
        name,
        email,
        phone: phone || null,
        subject,
        message,
        timestamp: new Date().toISOString(),
    };

    contacts.push(newContact);
    console.log('New contact submission:', newContact);

    res.status(201).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        contact: newContact,
    });
});

// GET /api/contacts - Get all contacts (optional, for admin)
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/items`);
});
