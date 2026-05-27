if(process.env.NODE_ENV == "production"){
   module.exports = {mongoURI: "mongodb+srv://simao:m0LL473plMxcSpke@projectonode.2wl20wf.mongodb.net/?appName=projectoNODE"} 
} else{
    module.exports = {mongoURI: "mongodb://127.0.0.1:27017/blogapp"}
}