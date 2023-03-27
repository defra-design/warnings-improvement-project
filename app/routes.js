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


// added for filter 2 option

// Techspike routes START

const _ = require('underscore')
const { getData } = require('../app/data')
const data = getData()

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

router.get('/principles-list', (req, res) => {
    const sortedData = _.sortBy(data, 'principleTitle')
    const groupedData = _.groupBy(sortedData, 'sectionNumber')
    const allData = _.sortBy(data, 'sectionNumber')
    // console.log(groupedData)
    res.render('principles-list.html', { groupedData, sortedData, allData });
})

// router.get('/:principleTitle', (req, res) => {
//     const { principleTitle } = req.params
//     const item = _.findWhere(data, {principleTitle: capitalizeFirstLetter(principleTitle.replace('-', ' '))})
//     res.render('principle.html', { item });
// })


//router.get('/:termName', (req, res) => {
 //   const { termName } = req.params
 //   const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
 //   res.render('principles.html', { item })
//})


// Techspike routes END



router.post('/principles-list/apply-filters', (req, res) => {
  if (req.session.data.clearFilters == "true") {
    req.session.data.section = ""
    req.session.data.role = ""
    req.session.data.priority = ""
    req.session.data.criticalityToBusiness = ""
    req.session.data.filteredResults = ""
    req.session.data.clearFilters = ""
  } else {

  console.log('success test')
  
  const allData = _.sortBy(data, 'sectionNumber')
  // console.log(allData)

  // let filteredResults = ''
  // console.log(filteredResults)



// Working filter for principles section - DO NOT DELETE - START

//   let sectionFilter = req.session.data.section
//   if (typeof sectionFilter === 'undefined') {
//     sectionFilter= ""
//  }
//  if (typeof sectionFilter.length) {
//     filteredResults = allData.filter(el => ( sectionFilter.indexOf(el.section) >= 0 ))
//  }

//   console.log(sectionFilter)

// Working filter for principles section - DON NOT DELETE - END



// Option 1: Only works for a single UCD discipline (content), doesn't work in conjunction with the section filter

//   let disciplineFilter = req.session.data.disciplineContent
//   if (typeof disciplineFilter === 'undefined') {
//     disciplineFilter= ""
//  }
//  if (typeof disciplineFilter.length) {
//     filteredResults = allData.filter(el => ( disciplineFilter.indexOf(el.disciplineContent) >= 0 ))
//  }

//   console.log(disciplineFilter)






// Option 2: Chris filter example test


//array of objects
// let foo = [
//   { items: ["Content design"] },
//   { items: ["Content design", "Interaction design"] },
//   { items: ["Content design", "Service design"] },
//   { items: ["Service design"] }
// ];

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
  res.redirect('/principles-list') 
})


module.exports = router
