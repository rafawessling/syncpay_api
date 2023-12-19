const express = require("express");
const { listClients, registerClient, updateClients, getClient, getStatusClient } = require("../controllers/clients");
const schemaClient = require("../validations/clientSchema");
const schemaLogin = require("../validations/loginSchema");
const { schemaRegister, schemaUpdate } = require("../validations/userSchema");
const validateUser = require("../middlewares/authentication");
const { validateEmail, validateRequestBody, validateEmailCpfUpdate } = require("../middlewares/validateRequests");
const { loginUser, registerUser, updateUser, getUserProfile, getEmail } = require("../controllers/users");
const { registerCharges, getCharges, listChargesClient, getChargeDetails, updateCharge, deleteCharge } = require("../controllers/charges");
const schemaCharges = require("../validations/chargeSchema");



const router = express.Router();

router.post('/user', validateRequestBody(schemaRegister), validateEmail('users'), registerUser);
router.post('/login', validateRequestBody(schemaLogin), loginUser);
router.get('/users/email', getEmail)


router.use(validateUser)

router.put('/user/:id', validateRequestBody(schemaUpdate), validateEmailCpfUpdate('users'), updateUser);
router.get('/user', getUserProfile);

router.post("/registerClient", validateRequestBody(schemaClient), registerClient);
router.put("/client/:id", validateRequestBody(schemaClient), validateEmailCpfUpdate('clients'), updateClients);
router.get("/listClients", listClients);
router.get("/clients/:id", getClient);

router.post("/clients/:id/charges", validateRequestBody(schemaCharges), registerCharges);
router.get('/charges', getCharges)
router.get('/clients/:id/charges', listChargesClient);
router.put('/charges/:id', updateCharge);
router.delete('/charges/:id', deleteCharge);


module.exports = router;



