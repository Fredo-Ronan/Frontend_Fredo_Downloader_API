import axios from "axios";

export const BASE_URL = "https://fredo-downloader-api.vercel.app";
// export const BASE_URL = "http://localhost:3000";

export const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
})