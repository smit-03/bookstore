import { toast } from "react-toastify";
import cartService from "../service/cart.service";
import { Role, RoutePaths } from "./enum";

const addToCart = async (book, id) => {
    return cartService
        .add({
            userId: id,
            bookId: book.id,
            quantity: 1,
        })
        .then((res) => {
            console.log("add ", res);
            return { error: false, message: "Item added in cart" };
        })
        .catch((e) => {
            if (e.status === 409) {
                return { error: true };
            }
            console.log("error ", e);
            toast.error("Something went wrong")
            return { error: true };
        });
};

const messages = {
    USER_DELETE: "are you sure you want to delete the user?",
    UPDATED_SUCCESS: "Record updated successfully",
    UPDATED_FAIL: "Record cannot be updated",
    DELETE_SUCCESS: "Record deleted successfully",
    DELETE_FAIL: "Record cannot be deleted",
    ORDER_SUCCESS: "Your order is successfully placed",
};

const localStorageKeys = {
    USER: "user",
};

const NavigationItems = [
    {
        name: "Users",
        route: RoutePaths.user,
        access: [Role.Admin],
    },
    {
        name: "Categories",
        route: RoutePaths.category,
        access: [Role.Admin],
    },
    {
        name: "Books",
        route: RoutePaths.book,
        access: [Role.Admin, Role.Seller],
    },
    {
        name: "Update Profile",
        route: RoutePaths.updateprofile,
        access: [Role.Admin, Role.Buyer, Role.Seller],
    },
];

const hasAccess = (pathname, user) => {
    const navItem = NavigationItems.find((navItem) =>
        pathname.includes(navItem.route)
    );
    if (navItem) {
        return (
            !navItem.access ||
            !!(navItem.access && navItem.access.includes(user.roleId))
        );
    }
    return true;
};

export default {
    addToCart,
    messages,
    hasAccess,
    localStorageKeys,
    NavigationItems,
};