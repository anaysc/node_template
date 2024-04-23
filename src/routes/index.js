import Router from 'koa-router'
import getHealth from './health/health'
import cart from './cart/cart'

const router = new Router()

router.get('/health', getHealth)
router.post('/api/get-promotions', cart.getPromotions)

export default router
