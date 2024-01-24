import { useAxios } from "./apiConfig";

export const DownloadInstagram = async (url) => {
    console.log(url + " dari api function");
    const response = await useAxios.get(`/instagram-download?url=${url}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    return response.data;
}

export const DownloadYoutube = async (url) => {
    console.log(url + " dari api function");
    const response = await useAxios.get(`/youtube-download?url=${url}`, {
        headers: {
            "Content-Type" : "application/json",
        }
    });

    return response.data;
}