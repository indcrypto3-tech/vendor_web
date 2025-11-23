require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Lightweight health endpoint to verify the function is reachable without DB
app.get('/health', (req, res) => {
	res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/vendors', vendorRoutes);

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
	db.connect().then(() => {
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	}).catch(err => {
		console.error('DB connection error', err);
		process.exit(1);
	});
}

module.exports = app;
