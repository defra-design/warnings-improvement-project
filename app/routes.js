const express = require('express')
const router = express.Router()

const filters = require('./filters')(process.env)

// Add your routes here - above the module.exports line

// all routes for registration v2
router.use('/v2', require('./routes_v2')),
router.use('/v4', require('./routes_v4')),
router.use('/v5', require('./routes_v5')),
router.use('/v6', require('./routes_v6')),
router.use('/v7', require('./routes_v7')),
router.use('/v01-1', require('./routes_v01-1')),
router.use('/v01-2', require('./routes_v01-2')),
router.use('/v02-1', require('./routes_v02-1'))



// Route index page
router.get('/', function (req, res) {
	res.render('index')
})

router.all('*', (req, res, next) => {
	req.session.data.postcodeNotFound = false
	next()
})

let addressLookupRouter = require('./routes/address-lookup')
router.use('/address-lookup', addressLookupRouter)

let placeRouter = require('./routes/place')
router.use('/place', placeRouter)

let locationRouter = require('./routes/location')
router.use('/location', locationRouter)

let placeRouter3 = require('./routes_v4/place')
router.use('/place', placeRouter)

let locationRouter3 = require('./routes_v4/location')
router.use('/location', locationRouter)

// CLEAR SESSION ==============================================================
router.get('/cls', function (req, res) {
	req.session.destroy()
	res.render('index')
  })

// set up route variable default status
  router.get('/default', function (req, res) {
	req.session.data = { route: 'default' }
	res.redirect(`/v02-1/choosewarnings/overview-flood`)
})

// set up route variable customise status
router.get('/customise', function (req, res) {
	req.session.data = { route: 'customise' }
	res.redirect(`/v02-1/choosewarnings/overview-flood`)
})

module.exports = router
