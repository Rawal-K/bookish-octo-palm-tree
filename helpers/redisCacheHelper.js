const redis = require("redis");
const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

checkCache = (id) => {
        return new Promise((resolve, reject) => {
                redis_client.get(id, (err, data) => {
                        if(err){
                                reject(err);
                        }
                        if(data!= null){
                                resolve(data);
                        }else{
                                resolve(1);
                        }
                });
        });
};

clearCache = (id) => {
        return new Promise((resolve, reject) => {
                redis_client.del(id, (err, data)=> {
                        resolve(data);
                });
        });
}

module.exports = {
	checkCache,
	clearCache
}
