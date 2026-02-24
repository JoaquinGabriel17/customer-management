import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Aquí es donde realmente "vive" el proceso de red
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});