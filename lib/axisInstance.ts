import axios from "axios";

export default axios.create({
    headers: {
        post: {
            "Content-Type": "application/json"
        }
    }
})