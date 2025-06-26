const express = require('express');
const router = express.Router();
const stockPricesController = require('../controller/stockPricesController')
const { generateToken, jwtAuthMiddleware } = require('../utils/jwt')

router.post('/add', jwtAuthMiddleware,stockPricesController.addUserStocks) ;
router.get('/mystocks',jwtAuthMiddleware, stockPricesController.getUserStocks);
router.patch('/update/:stockId',jwtAuthMiddleware,stockPricesController.updateUserStocks);
router.delete('/delete/:stockId',jwtAuthMiddleware,stockPricesController.deleteUserStock);
router.get('/matrix',jwtAuthMiddleware,stockPricesController.showStockMatrix);
router.get('/showprices',jwtAuthMiddleware,stockPricesController.showStocksRealTimePrices);
   
   

module.exports = router;