import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let restaurants

export default class RestaurantsDAO{
    static async injectDB(conn){
        if(restaurants)
        {
            return
        }
        try{
            restaurants = await conn.db(process.env.REST_NS).collection("restaurants")
        }
        catch(e)
        {
            console.error(`Unable to secure a connection to the database: ${e}`)
        }
    }

    static async getRestaurants({
        filters =null,
        page = 0,
        restPerPage = 20,
    } = {}){
        let query

        if(filters)
        {
            if("name" in filters){
                query = {$text: {$search: filters["name"]}}
            }else if ("cuisine" in filters){
                query = {"cuisine": {$eq: filters["cuisine"]}}
            }else if ("zipcode" in filters){
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor
        try{
            cursor = await restaurants.find(query)
        }catch(e)
        {
            console.error(`Unable to issue find command, ${e}`)
            return {restaurantsList: [], totalRestaurants: 0}
        }

        const displayCursor = cursor.limit(restPerPage).skip(restPerPage * page)

        try{
            const restaurantsList = await displayCursor.toArray()
            const totalRestaurants = await restaurants.countDocuments(query)    
            return {restaurantsList, totalRestaurants}
        }
        catch(e)
        {
            console.error(`Unable to issue find command, ${e}`)
        }
        return {restaurantsList: [], totalRestaurants: 0}

    }

    static async getRestaurantByID(id){
        try{
            const pipeline = [
                {
                    $match: {_id: ObjectId(id),},
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: { id: "$_id",},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ "$restaurant_id","$$id"],    
                                    },
                                },
                            },
                            {
                                $sort: { date: -1,},
                            },

                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields:{
                        reviews: "$reviews",
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next()
        }
        catch(e)
        {
            console.error(`Some went wrong in the data pipeline for reviews: ${e}`)
            throw e
        }
    }

    
    static async getRestaurantCuisines(){
        let cuisines = []
        try{
            cuisines = await restaurants.distinct("cuisine")
            return cuisines 
        }
        catch(e)
        {
            console.error(`Unable to get Cuisines ${e}`)
            return cuisines
        }
    }


}