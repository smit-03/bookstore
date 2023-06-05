import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./auth.context";
import cartService from "../service/cart.service";

const initialCartDetails = {
    cartData: [],
    updateCart: () => { },
    emptyCart: () => { },
}

const CartContext = createContext(initialCartDetails);

export const CartWrapper = ({ children }) => {
    const authContext = useAuthContext();
    const [cartData, setCartData] = useState([]);
    const emptyCart = () => {
        setCartData([]);
    };
    const updateCart = (updateCartList) => {
        if (updateCartList) {
            setCartData(updateCartList);
        }
        else if (authContext.user.id) {
            cartService
                .getList(authContext.user.id)
                .then((res) => setCartData(res));
        }
    }

    useEffect(() => {
        updateCart();
    }, [authContext.user.id])

    const value = {
        cartData,
        emptyCart,
        updateCart,
    };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
};

export const useCartContext = () => {
    return useContext(CartContext);
};
