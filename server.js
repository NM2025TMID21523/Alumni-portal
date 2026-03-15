const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple JSON file database for testing
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    users: [],
    webinars: [],
    mentorship_requests: [],
    events: [],
    announcements: [],
    gallery_images: [],
    fundraising_campaigns: [],
    donors: [],
    community_posts: [],
    private_messages: [],
    notifications: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading database:', err);
    throw new Error(`Failed to read database: ${err.message}`);
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database:', err);
    throw new Error(`Failed to write database: ${err.message}`);
  }
}

console.log('Connected to JSON database');

// Helper function to handle database queries
const query = (table) => {
  const data = readDB();
  return data[table] || [];
};

const insert = (table, record) => {
  const data = readDB();
  if (!data[table]) {
    throw new Error(`Table ${table} does not exist in database`);
  }
  const ids = data[table].map(r => r.id || 0);
  const id = (ids.length > 0 ? Math.max(...ids) : 0) + 1;
  const insertedRecord = {
    ...record,
    id,
    created_at: new Date().toISOString(),
  };
  data[table].push(insertedRecord);
  writeDB(data);
  return { insertId: id, record: insertedRecord };
};

const update = (table, id, updates) => {
  const data = readDB();
  const index = data[table].findIndex(r => r.id == id);
  if (index !== -1) {
    data[table][index] = { ...data[table][index], ...updates };
    writeDB(data);
  }
  return { changes: index !== -1 ? 1 : 0 };
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const results = query('users');
    console.log('Retrieved users:', results.length);
    res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err.message, err.stack);
    res.status(500).json({ error: err.message, details: err.stack });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    console.log('Creating user:', req.body);
    const result = insert('users', req.body);
    console.log('User created with ID:', result.insertId);
    res.json(result.record);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: err.message, details: err.stack });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    update('users', id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webinars
app.get('/api/webinars', async (req, res) => {
  try {
    const results = query('webinars');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/webinars', async (req, res) => {
  try {
    const result = insert('webinars', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mentorship Requests
app.get('/api/requests', async (req, res) => {
  try {
    const results = query('mentorship_requests');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const result = insert('mentorship_requests', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = update('mentorship_requests', id, { status });
    if (!result.changes) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const results = query('events');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const results = query('announcements');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const results = query('gallery_images');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const result = insert('gallery_images', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const results = query('fundraising_campaigns');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const result = insert('fundraising_campaigns', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Donors
app.get('/api/donors', async (req, res) => {
  try {
    const results = query('donors');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Posts
app.get('/api/posts', async (req, res) => {
  try {
    const results = query('community_posts');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const result = insert('community_posts', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const results = query('private_messages')
      .filter(message => (
        (String(message.sender_id) === String(userId1) && String(message.receiver_id) === String(userId2)) ||
        (String(message.sender_id) === String(userId2) && String(message.receiver_id) === String(userId1))
      ))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const result = insert('private_messages', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const results = query('notifications').filter(n => n.user_id === userId || n.user_id === 'all');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const result = insert('notifications', req.body);
    res.json(result.record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    update('notifications', id, { read_status: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
