//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


// all routes for registration v2
router.use('/v2', require('./routes_v2')),
router.use('/v4', require('./routes_v4')),
router.use('/v5', require('./routes_v5')),
router.use('/v6', require('./routes_v6')),
router.use('/v7', require('./routes_v7')),
router.use('/v01-1', require('./routes_v01-1')),
router.use('/v01-2', require('./routes_v01-2')),
router.use('/v02-1', require('./routes_v02-1')),
router.use('/v02-2', require('./routes_v02-2'))



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

router.post(['/locations-no-warnings/apply-filters', '/customise-settings/apply-filters'], (req, res) => {
  if (req.session.data.clearFilters == "true") {
    req.session.data.section = ""
    req.session.data.metres = ""
    req.session.data.role = ""
    req.session.data.priority = ""
    req.session.data.criticalityToBusiness = ""
    req.session.data.filteredResults = ""
    req.session.data.clearFilters = ""
  } else if (req.session.data.continueLocations == "true" && req.originalUrl === '/locations-no-warnings/apply-filters') {
    req.session.data.section = ""
    req.session.data.metres = ""
    req.session.data.role = ""
    req.session.data.priority = ""
    req.session.data.criticalityToBusiness = ""
    req.session.data.filteredResults = ""
    res.redirect('/v02-1/choosewarnings/flood-warnings-success');
  } else if (req.session.data.continueSettings == "true" && req.originalUrl === '/customise-settings/apply-filters') {
    req.session.data.section = ""
    req.session.data.metres = ""
    req.session.data.role = ""
    req.session.data.priority = ""
    req.session.data.criticalityToBusiness = ""
    req.session.data.filteredResults = ""
    res.redirect('/v02-1/choosewarnings/flood-warnings-set');
  } else {
    console.log('success test')

  const allData = _.sortBy(data, 'sectionNumber')

//filters
let priorityFilter = req.session.data.priority;
let criticalityToBusinessFilter = req.session.data.criticalityToBusiness;

//set global scope of filtered results
let filteredResults = [];

//loop through each of the objects
for (i of allData) {
  // console.log(i.priority);
  //if the object contains a matching value from the filter then add it to the filtered results array

  if (typeof priorityFilter === 'undefined') {
    priorityFilter= "";
  }
  if (i.priority.some((value) => priorityFilter.includes(value))) {
    filteredResults.push(i);
  }

  if (typeof criticalityToBusinessFilter === 'undefined') {
    criticalityToBusinessFilter= "";
  }

  console.log("i.criticalityToBusiness:", i.criticalityToBusiness);
  console.log("criticalityToBusinessFilter:", criticalityToBusinessFilter);

  if (Array.isArray(i.criticalityToBusiness) && i.criticalityToBusiness.some((value) => criticalityToBusinessFilter.includes(value))) {
    filteredResults.push(i);
  }
}

console.log("filteredResults:", filteredResults);



//   let roleFilter = req.session.data.role
//   if (typeof roleFilter === 'undefined') {
//     roleFilter= ""
//  }
//  if (typeof roleFilter.length) {
//     filteredResults = allData.filter(el => ( roleFilter.indexOf(el.role,el.role1,el.role2,el.role3) >= 0 ))
//  }



  req.session.data.filteredResults = filteredResults

}
  // get the URL of the page the user came from
  const refererUrl = req.header('Referer');



  // redirect the user back to the page they came from
  res.redirect(refererUrl);
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


require('@x-govuk/edit-prototype-in-browser').addRoutes(require('govuk-prototype-kit').requests)
