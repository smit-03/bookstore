import { Container, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PageTitle } from "../../style";
import { useAuthContext } from "../../context/auth.context";
import { useCartContext } from "../../context/cart.context";
import { useNavigate } from "react-router-dom";
import cartService from "../../service/cart.service";
import orderService from "../../service/order.service";
import { toast } from "react-toastify";
import shared from "../../utils/shared";
import { RoutePaths } from "../../utils/enum";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import emptycart from "../../assets/images/emptycart.png";

const EmptyCart = styled("div")`
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  height: 88vh;
  width: 100%;
  background-color: #f8f8f8;
`;

const CartImage = styled("img")`
  width: 60vw;
  height: 33vw;
  margin-left: 20%;
  margin-top: 7vh;
`;
const ItemContainer = styled("div")`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2vh;
  margin-left: auto;
  box-sizing: border-box;
  margin-right: auto;
`;
const CartItem = styled("div")`
  display: flex;
  flex-direction: row;
  margin-top: 1.5rem;
  border: 1px solid #bcbcbc;
  border-radius: 8px;
  padding: 0.8rem;
  width: 85%;
  color: #3c3c3c;
`;

const BookImage = styled("img")`
  width: 10vw;
  height: 15vh;
  object-fit: cover;
  margin-right: 1rem;
`;

const ButtonContainer = styled("div")`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled(Button)`
  margin: 0.5rem 0.7rem;
  font-size: 1.5rem;
  height: 23px;
  width: 23px;
  padding: 0;
  min-width: unset !important;
`;
const Quant = styled("span")`
  font-size: 1rem;
  border: 1px solid #838383;
  padding: 0px 7px 1px 6px;
  max-width: 13vw;
`;

const Cart = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemsInCart, setItemsInCart] = useState(0);

  const getTotalPrice = (itemList) => {
    let total = 0;
    itemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      total = total + itemPrice;
    });
    setTotalPrice(total);
  };

  useEffect(() => {
    setCartList(cartContext.cartData);
    setItemsInCart(cartContext.cartData.length);
    getTotalPrice(cartContext.cartData);
  }, [cartContext.cartData]);

  const removeItem = async (id) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const updateQuantity = async (cartItem, inc) => {
    const currentCount = cartItem.quantity;
    const quantity = inc ? currentCount + 1 : currentCount - 1;
    if (quantity === 0) {
      removeItem(cartItem.id);
      return;
    }
    try {
      const res = await cartService.updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      });
      if (res) {
        const updatedCartList = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, quantity } : item
        );
        cartContext.updateCart(updatedCartList);
        const updatedPrice =
          totalPrice +
          (inc
            ? parseInt(cartItem.book.price)
            : -parseInt(cartItem.book.price));
        setTotalPrice(updatedPrice);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const PlaceOrder = async () => {
    if (authContext.user.id) {
      const userCart = await cartService.getList(authContext.user.id);
      if (userCart.length) {
        try {
          let cartIds = userCart.map((element) => element.id);
          const newOrder = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            cartContext.updateCart();
            navigate(RoutePaths.home);
            toast.success(shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error("Order Failed, Try again");
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };

  return (
    <>
      {itemsInCart ? (
        <Container Container style={{ marginTop: "15vh" }}>
          <PageTitle>Cart Page</PageTitle>
          <span
            style={{ margin: "0 24%", fontWeight: "600", fontSize: "1.3rem" }}
          >
            My Cart ({itemsInCart} Items)
          </span>
          <ItemContainer>
            {cartList.map((cartItem) => {
              return (
                <CartItem key={cartItem.id}>
                  <BookImage
                    src={cartItem.book.base64image}
                    alt={cartItem.book.name}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {cartItem.book.name}
                    </div>
                    <ButtonContainer>
                      <QuantityButton
                        variant="contained"
                        onClick={() => updateQuantity(cartItem, true)}
                      >
                        +
                      </QuantityButton>
                      <Quant>{cartItem.quantity}</Quant>
                      <QuantityButton
                        variant="contained"
                        onClick={() => updateQuantity(cartItem, false)}
                      >
                        -
                      </QuantityButton>
                    </ButtonContainer>
                  </div>
                  <Container
                    style={{
                      width: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      marginRight: 0,
                      right: 0,
                    }}
                  >
                    <div
                      style={{
                        alignItems: "end",
                        right: 0,
                        fontWeight: "bold",
                      }}
                    >
                      MRP &#8377; {cartItem.book.price}
                    </div>
                    <IconButton
                      onClick={() => removeItem(cartItem.id)}
                      style={{ alignItems: "center" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Container>
                </CartItem>
              );
            })}
          </ItemContainer>
          <span
            style={{ margin: "0% 24%", fontWeight: "600", fontSize: "1.3rem" }}
          >
            Total Amount : &#8377; {totalPrice}
          </span>
          <Button
            style={{
              color: "white",
              backgroundColor: "#f82626",
              textTransform: "capitalize",
            }}
            onClick={PlaceOrder}
          >
            Place Order
          </Button>
        </Container>
      ) : (
        <EmptyCart>
          <CartImage src={emptycart} alt="emptycart" />
          <Button
            style={{
              color: "white",
              backgroundColor: "#f82626",
              textTransform: "capitalize",
              marginLeft: "47%",
            }}
            onClick={() => navigate(RoutePaths.home)}
          >
            Shop Now
          </Button>
        </EmptyCart>
      )}
    </>
  );
};

export default Cart;
