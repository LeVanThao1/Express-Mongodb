require('dotenv').config();
const express = require('express');
const app = express();
const csurf = require('csurf');
const port = process.env.PORT || 3000;
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/auth.middleware');
const authRoute = require('./routes/auth.route');
const sessionMiddleware = require('./middlewares/session.middleware');
const cartRoute = require('./routes/cart.route');
const transferRoute = require('./routes/transfer.route');
const mongoose = require('mongoose');

app.set('view engine', 'pug');
app.set('views', './views');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
// app.use(sessionMiddleware.sessionId);
const csrfProtection = csurf({ cookie: true});

app.get('/', authMiddleware.requireAuth, (req, res) => res.render('index', {name: "Lê Văn Thảo"}));
app.get('/logout', (req, res) => res.clearCookie('userId').clearCookie('sessionId').redirect('/auth/login'));
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/cart', authMiddleware.requireAuth, cartRoute);
app.use('/', authRoute);
app.use('/transfer', csrfProtection ,authMiddleware.requireAuth, transferRoute);


app.listen(port, () => console.log('Server listen on port ' + port));
