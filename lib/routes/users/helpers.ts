import { Users} from '../../db';
export class UserHelpers {

    public static create = async (document)=>{
        return Users.create(document)
    }

    public static getAll = async(query: {page:any, limit:any, searchValue:any})=>{
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 5;
        const searchValue = query.searchValue;
        const skips = (page - 1) * limit;
        let matchQuery:any[] = [];
        if(searchValue && searchValue.length){
            matchQuery.push({firstName: {$regex: searchValue, $options: "i"}});
            matchQuery.push({lastName: {$regex: searchValue, $options: "i"}});
            matchQuery.push({email: {$regex: searchValue, $options: "i"}});
            matchQuery.push({contact: {$regex: searchValue}});
            matchQuery.push({"eduProgress.school": {$regex: searchValue, $options: "i"}});
        }

        console.log(matchQuery)
        if(matchQuery.length > 0){
            return Users.aggregate([
                // {
                //     $unwind: "$eduProgress"
                // },
                {
                    $match: {
                        $or: matchQuery,
                        // $or:[...matchQuery, {"eduProgress.school":{$regex: searchValue}}]
                    }
                },
                // {
                //     "$group": {
                //         "_id": "$_id",
                //         "firstName": { "$first": "$firstName" },
                //         "lastName": { "$first": "$lastName" },
                //         "email": { "$first": "$email" },
                //         "address": { "$first": "$address" },
                //         "contact": { "$first": "$contact" },
                //         // "companyId": { "$first": "$companyId" },
                //         // "cardTypeId": { "$first": "$cardTypeId" },
                //         "eduProgress": { "$push": "$$ROOT.eduProgress" }
                //     }
                // },
                {
                    $facet: {
                        data: [
                            {
                                $skip: skips,
                            }, {
                                $limit: limit
                            }
                        ], count: [
                            {
                                $count: "count"
                            }
                           
                        ]
                    }
                }
            ]);
        }
        if(matchQuery.length === 0){
            return Users.aggregate([
                {
                    $facet: {
                        data: [
                            {
                                $skip: skips,
                            }, {
                                $limit: limit
                            }
                        ], count: [
                            {
                                $count: "count"
                            }
                           
                        ]
                    }
                }
            ]);
        }
       
    }

    public static findById = async (id)=>{
        return Users.findById(id);
    }

    public static updateOne = async(document)=>{
        const update = {
            ...document
        }
        return Users.findByIdAndUpdate(update._id, update, {new: true} );
    }

    public static hardDelete = async (id:string)=>{
        const query = {"_id": id};
        return Users.remove(query);
    }
    
}