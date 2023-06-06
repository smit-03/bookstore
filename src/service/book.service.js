import request from "./request";

const ENDPOINT = "api/book";

export const searchBook = (searchText) => {
    const url = `${ENDPOINT}/search?keyword=${searchText}`;
    return request.get(url).then((res) => {
        return res;
    })
};


export const getAllPaginatedBooks = (pageSize, pageIndex) => {
    const url = `${ENDPOINT}?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    return request.get(url).then((res) => {
        return res;
    });
};

export const getAllBooksOfKeyword = (pageSize, pageIndex, keyword) => {
    const url = `${ENDPOINT}?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`;
    return request.get(url).then((res) => {
        return res;
    });
};

export const getAllBooks = () => {
    const url = `${ENDPOINT}/all`;
    return request.get(url).then((res) => {
        return res;
    });
};



export const addBook = (bookData) => {
    const url = `${ENDPOINT}`;
    return request.post(url, bookData).then((res) => {
        return res;
    });
};

export const updateBook = (bookData) => {
    const url = `${ENDPOINT}`;
    return request.put(url, bookData).then((res) => {
        return res;
    });
};

export const deleteBook = (bookId) => {
    const url = `${ENDPOINT}?id=${bookId}`;
    return request.delete(url).then((res) => {
        return res;
    });
};

export const getBookById = (bookId) => {
    const url = `${ENDPOINT}/byId?id=${bookId}`;
    return request.get(url).then((res) => {
        return res;
    });
};
