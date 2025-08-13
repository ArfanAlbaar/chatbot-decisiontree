import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://admin.absurdstore.web.id/api",
  headers: {
    Accept: "application/json",
  },
});

export const getProducts = () => {
  return apiClient.get("/products");
};

export const getProductById = (id, config) => {
  return apiClient.get(`/products/${id}`, config);
};

export const createOrder = (orderData) => {
  return apiClient.post("/orders", orderData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createReturn = (returnData) => {
  return apiClient.post("/returns", returnData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getReturnByCode = (returnCode) => {
  return apiClient.get(`/returns/${returnCode}`);
};

export const recordChat = (chatData) => {
  return apiClient.post("/record-chat", chatData);
};
