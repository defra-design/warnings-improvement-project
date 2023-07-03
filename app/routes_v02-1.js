const express = require('express')
const router = express.Router()

var folder = "v02-1"
var servicename = "Get flood warnings by phone, text or email"
var paymentMethod = "govpay"  // or "govpay"


// HTML for standard buttons
var backlink = '<a href="javascript:history.back()" class="govuk-back-link">Back</a>'
var submitButton = '<button type="submit" id="continueButton" class="govuk-button" name="Continue">Continue</button>'
//var completeLink = '<a id="completeLink" href="/'+folder+'/save-and-return/check">Continue later</a>'
var completeLink = ''

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

router.use(function (req, res, next) {
    // set a folder and store in locals
    // this can then be used in pages as {{folder}}
    res.locals.folder=folder
    res.locals.backlink=backlink
    res.locals.submitButton=submitButton
    res.locals.completeLink=completeLink
    res.locals.paymentMethod=paymentMethod
    res.locals.serviceName=servicename
    // permit and autostore data set in all statement at bottom
    res.locals.permit=res.locals.data
    next()
  });




  // Run this code when a form is submitted to 'no-warning-answer'
  router.post('/no-warning-answer', function (req, res) {

    // Make a variable and give it the value from 'no-warning'
    var noWarning = req.session.data['no-warning']

    // Check whether the variable matches a condition
    if (noWarning == "increase"){
      // Send user to next page
      res.redirect('/v02-1/choosewarnings-customise/locations-no-warnings-found')
    }


     else {
      // Send user to success page
      res.redirect('/v02-1/choosewarnings-customise/flood-warnings-success')
    }

  })


  // Run this code when a form is submitted to 'flood-warning-answer'
  router.get('/flood-warning-answer', function (req, res) {

    // Make a variable and give it the value from 'flood-warning'
    var floodWarning = req.session.data['flood-warning']

    // Check whether the variable matches a condition
    if (floodWarning == "customise"){
      // Send user to next page
      res.redirect('/v02-1/choosewarnings/customise-settings')
    }


     else {
      // Send user to success page
      res.redirect('/v02-1/choosewarnings/flood-warnings-set')
    }

  })


  // Run this code when a form is submitted to 'flood-warning-answer'
  router.get('/flood-warning-answer-customise', function (req, res) {

    // Make a variable and give it the value from 'flood-warning'
    var floodWarningCustomise = req.session.data['floodWarningCustomise']

    // Check whether the variable matches a condition
    if (floodWarningCustomise == "complex"){
      // Send user to next page
      res.redirect('/v02-1/choosewarnings/customise-settings')
    }


     else {
      // Send user to success page
      res.redirect('/v02-1/choosewarnings/flood-warnings-set')
    }

  })

  // Run this code when a form is submitted to 'flood-edit-answer'
  router.post('/flood-edit-answer', function (req, res) {

    // Make a variable and give it the value from 'flood-edit'
    var floodEdit = req.session.data['flood-edit']

    // Check whether the variable matches a condition
    if (floodEdit == "customise"){
      // Send user to next page
      res.redirect('/v02-1/choosewarnings-edit/customise-settings')
    }


     else {
      // Send user to success page
      res.redirect('/v02-1/choosewarnings-edit/are-you-sure')
    }

  })


// customise or default user journey routing ==============================================================

router.get('/choosewarnings/flood-options', function (req, res) {
	res.render(folder + '/choosewarnings/flood-options',{
		"formAction":"/"+ folder + "/choosewarnings/flood-options-routing"
	})
  })
  
  router.post('/choosewarnings/flood-options', function (req, res) {
	res.render(folder + '/choosewarnings/flood-options',{
		"formAction":"/"+ folder + "/choosewarnings/flood-options-routing"
	})
  })
  
// Send permit data in session to every page ==================================
router.all('*', function (req, res, next) {
  res.locals.permit=res.locals.data
  next()
})
  
  // Route to check if application has started and redirect
  router.post('/choosewarnings/flood-options-routing', function (req, res) {
	if (req.body['floodWarningCustomise']=="complex") {
	  res.redirect("/"+ folder + "/flood-warning-answer-customise")
	} else {
	  res.redirect("/"+ folder + "/flood-warning-answer")
	}
  })


module.exports = router
