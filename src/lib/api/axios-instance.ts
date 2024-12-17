import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dubte1y7uk.execute-api.ap-northeast-1.amazonaws.com/", // TODO: 環境変数を使う
  headers: {
    "Access-Control-Allow-Origin": "*", // TODO: ガバガバすぎるのでいずれなんとかする
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
