import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TollGate backend server running on port ${PORT}`);
});
