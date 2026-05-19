const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const http       = require('http');
const path       = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes  = require('./routes/product');
const orderRoutes    = require('./routes/order');
const userRoutes     = require('./routes/user');
const supplierRoutes = require('./routes/supplier'); // ← ADD THIS LINE


const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

// Make io available in controllers
app.set('io', io);

app.use(cors());
app.use(express.json());

// Serve uploaded profile pictures as static files
// Access via: http://localhost:5000/uploads/profiles/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('✅ Inventory API Running'));

app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/suppliers',  supplierRoutes); // ← ADD THIS LINE


io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Disconnected:', socket.id));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err  => console.error('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));