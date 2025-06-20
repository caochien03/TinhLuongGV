import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api", // Đổi lại nếu backend chạy port khác hoặc deploy
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;
