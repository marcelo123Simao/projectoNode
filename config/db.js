if(process.env.NODE_ENV == "production"){
   module.exports = {mongoURI: "mongodb+srv://simao:marcelo12345@@aws.vpqdnco.mongodb.net/?appName=AWS"} 
} else{
    module.exports = {mongoURI: "mongodb://127.0.0.1:27017/blogapp"}
}