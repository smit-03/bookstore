import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCartContext } from "../../context/cart.context";
import { useAuthContext } from "../../context/auth.context";
import shared from "../../utils/shared";
import { toast } from "react-toastify";

const BookDetailsOverlay = ({ book, onClose }) => {
  const cartContext = useCartContext();
  const authContext = useAuthContext();
  if (!book) {
    return null;
  }
  const addToCart = (book) => {
    shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        cartContext.updateCart();
        toast.success(res.message);
      }
    });
  };
  const { name, description, price, base64image } = book;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "80vh",
          minWidth: "320px",
          minHeight: "470px",
          maxWidth: "40vw",
          overflow: "hidden",
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          maxWidth: "80%",
        },
      }}
    >
      <IconButton
        edge="end"
        color="inherit"
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "18%",
              width: "35%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={base64image}
              alt={name}
              style={{
                minWidth: "150px",
                minHeight: "200px",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <Typography variant="h5" align="center">
            {name}
          </Typography>
          <Typography variant="subtitle1" align="center">
            {description}
          </Typography>
          <Typography variant="h6" align="center">
            MRP: &#8377; {price}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ textTransform: "capitalize", marginTop: "2vh" }}
            onClick={() => {
              addToCart(book);
              // onClose();
            }}
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsOverlay;
