import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dubte1y7uk.execute-api.ap-northeast-1.amazonaws.com/prod/", // TODO: 環境変数を使う
  headers: {
    "Access-Control-Allow-Origin": "*", // TODO: ガバガバすぎるのでいずれなんとかする
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
