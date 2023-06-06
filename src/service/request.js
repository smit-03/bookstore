import axios from "axios";
import { toast } from "react-toastify";

let requests = [];

const request = axios.create({
    baseURL: "https://book-e-sell-node-api.vercel.app/",
    timeout: 12400000,
    responseType: "json",
});

// Request interceptors Customize based on your need
request.interceptors.request.use(
    async (config) => {
        if (config.headers) {
            config.headers["Content-Type"] = "application/json";
        }

        requests.push(config.url);

        return config;
    },
    (error) => {
        alert(error);
        Promise.reject(error);
    }
);

// Response interceptors Customize based on your need
request.interceptors.response.use(
    (response) => {
        const { data } = response;
        console.log("response,", response);
        removeRequest(response.config.url);
        if (data?.code && data?.code !== 200) {
            toast.error(
                response.data.error ?? "Something went wrong. Please try again!"
            );
            return Promise.reject(new Error(data?.error || "Error"));
        } else {
            return Promise.resolve(response.data.result);
        }
    },
    (error) => {
        removeRequest(error.config.url);
        toast.error(error?.response?.data?.error ?? "Something went wrong");
        return Promise.reject(error);
    }
);

// Remove completed request
function removeRequest(req) {
    const i = requests.indexOf(req);
    if (i >= 0) {
        requests.splice(i, 1);
    }
}
export default request;
