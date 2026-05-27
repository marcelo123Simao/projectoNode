if(process.env.NODE_ENV == "production"){
   module.exports = {mongoURI: "mongodb+srv://simao:simao12345@projectonode.2wl20wf.mongodb.net/blogapp?retryWrites=true&w=majority&appName=projectoNODE"} 
} else{
    module.exports = {mongoURI: "mongodb://127.0.0.1:27017/blogapp"}
}