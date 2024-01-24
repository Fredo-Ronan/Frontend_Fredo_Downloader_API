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

export const CheckLink = async (url) => {
    try {
        const response = await fetch(url, {method: "HEAD"});
        
        if(response.status === 403){
            return false;
        } else {
            return true;
        }
    } catch(e) {
        return false;
    }
}