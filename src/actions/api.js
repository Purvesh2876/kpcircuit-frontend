import axios from "axios";

// const baseURL = `${process.env.REACT_APP_API_URL}api`;
const baseURL = `${process.env.REACT_APP_API_URL}`;

const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export async function signup(username, name, email, password, mobile, dob) {
    try {
        const response = await instance.post("/auth/signup", {
            username,
            name,
            email,
            password,
            mobile,
            dob

        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function activate(email, activationCode) {
    try {
        console.log("Email:", email, "Activation Code:", activationCode);
        const response = await instance.post("/auth/activate", {
            email: email,
            activationCode: activationCode
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function login(email, password) {
    try {
        const response = await instance.post("/auth/login", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function handleGoogleLogin(tokenId) {
    try {
        const response = await instance.post("/auth/registerOrLogin", {
            tokenId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const response = await instance.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getSingleUser() {
    try {
        const response = await instance.post("/auth/getSingleUser");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAllCategories() {
    try {
        const response = await instance.get("/categories");
        return response.data;
    } catch (error) {
        throw error;
    }
}

// actions/api.js

// actions/api.js
export async function getAllProducts(params = {}) {
    try {
        const response = await instance.get("/products", {
            params,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchProducts = async (query) => {
    try {
        const response = await instance.get("/products/search", {
            params: { q: query },
        });

        return response.data;
    } catch (error) {
        console.error("Search API error:", error);
        return { products: [] };
    }
};



export async function getAllFeaturedProducts() {
    try {
        const response = await instance.get("/products", {
            params: {
                featured: true
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Cart API's

export async function getCart() {
    try {
        const response = await instance.get("/cart");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getCartTotal() {
    try {
        const response = await instance.get("/cart/total");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addToCartt(productId, quantity) {
    try {
        const response = await instance.post("/cart/add", {
            product: productId,
            quantity
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function removeFromCart(productId, color) {
    try {
        const response = await instance.post(`/cart/remove`, {
            productId: productId,
            color: color,
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// Wishlist API's

export async function getWishlist() {
    try {
        const response = await instance.get("/wishlist");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addToWishlistt(productId) {
    try {
        const response = await instance.post("/wishlist/add", {
            product: productId
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function removeFromWishlist(productId) {
    try {
        const response = await instance.post(`/wishlist/remove`, {
            productId: productId
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// subcategory get
export async function getSubCategoriesByCategory(categoryId) {
    try {
        const response = await instance.get(`/subcategory/category/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// order management api's

export async function createOrder(orderData) {
    try {
        // 1. Send orderData directly (no curly braces wrapping it)
        const response = await instance.post("/order/createOrder", orderData);

        // 2. Return ONLY the data payload
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyOrders = async (page = 1, limit = 5, search = "") => {
    try {
        const response = await instance.get("/order/myOrders", {
            params: {
                page,
                limit,
                search,
            },
        });

        return response;
    } catch (error) {
        console.error("Error fetching my orders:", error);
        throw error;
    }
};