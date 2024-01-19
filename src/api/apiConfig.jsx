import axios from "axios";

export const BASE_URL = "https://fredo-downloader-api.vercel.app";

export const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
})