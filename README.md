# Restaurant-Review-System
This is a Backend structure without any frontend implementations (no GUI). To use this structure you will need an application to interact with a HTTP - based API. 
Insomia has been used by me for testing this.

This system uses the sample database of restaurants from MongoDB and has the following features implemented to it-
- It can display all the available restaurants in the database and their info in detail
- It can filter out the displayed restaurants in the following ways: 
         ->By name
         ->By Zipcode
         ->By Cuisine of the restaurant
- The structure also has a review system added to it where a user with some user Id can leave a review about some restaurant using the restaurantID
- Further a review can be editted or deleted only by its owner

I do plan on making a frontend to this Structure so that the user can directly interact with the UI instead of having to send requests through a third party applicaton.
