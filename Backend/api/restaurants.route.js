import express from "express";
import RestCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";
const router = express.Router();

router.route("/").get(RestCtrl.apiGetRestaurants)
router.route("/id/:id").get(RestCtrl.apiGetRestaurantById)
router.route("/cuisines").get(RestCtrl.apiGetRestaurantCuisines)


router
.route("/review")
.post(ReviewsCtrl.apiPostReview)
.put(ReviewsCtrl.apiUpdateReview)
.delete(ReviewsCtrl.apiDeleteReview)

export default router
