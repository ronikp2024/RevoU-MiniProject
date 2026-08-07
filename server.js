const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
require('./src/db');
const { formatCurrency } = require('./src/helpers');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.formatCurrency = formatCurrency;
  next();
});

app.use('/', require('./src/routes/dashboard'));
app.use('/ternak', require('./src/routes/animals'));
app.use('/kebun', require('./src/routes/plants'));
app.use('/reminders', require('./src/routes/reminders'));
app.use('/keuangan', require('./src/routes/finance'));

app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Farm Manager berjalan di http://localhost:${PORT}`);
});
