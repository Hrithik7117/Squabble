  // "dev": "nodemon -r dotenv/config server.js",
    // "start":" node -r dotenv/config server.js"
import { app } from "./src/app.js";
import { server } from "./src/lib/socket.js";



server.listen(3000, () => {
    console.log("Server is running on Port 3000 ");
    
})


