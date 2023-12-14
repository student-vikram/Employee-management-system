const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tika');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// Create Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  salary:String,
  position: String,
  department: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
function authenticateUser(username, password) {
   
    return true
  }

// Routes
app.get('/home', (req, res) => {
  res.render('home');
});
app.get('/', (req, res) => {
  res.render('employeeLogin');
});
app.post('/employeeLogin', (req, res) => {
  const { username, password } = req.body;

  // Perform authentication logic (replace this with your actual authentication code)
  const isAuthenticated = authenticateUser(username, password);

  if (isAuthenticated) {
    res.redirect('/home');;
  } else {
    res.json({ message: 'Login failed' });
  }
});

app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('employee', { employees });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/addEmployee', (req, res) => {
  res.render('addEmployee');
});

app.post('/addEmployee', async (req, res) => {
  const { name, position, department } = req.body;

  try {
    await Employee.create({ name, position, department });
    res.redirect('/employees');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/editEmployee/:id', async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.render('editEmployee', { employee });
});

app.post('/editEmployee/:id', async (req, res) => {
  const { name, position, department } = req.body;
  try {
    await Employee.findByIdAndUpdate(req.params.id, { name, position, department });
    res.redirect('/employees');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/employeeDetail/:id', async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.render('employeeDetail', { employee });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
