import dynamic from "next/dynamic";
import Image from "next/image";
import { number, oneOfType, shape, string } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/reduxtoolkit/cart.slice";
import {
  openToast,
  setToastifyMsg,
  setToastifyType,
} from "@/reduxtoolkit/global.slice";

const AddShoppingCartIcon = dynamic(() =>
  import("@mui/icons-material/AddShoppingCart")
);
const DeleteIcon = dynamic(() => import("@mui/icons-material/Delete"));
const ProductCardWrapper = dynamic(() =>
  import("@/ui/Cards/ProductCardWrapper/ProductCardWrapper")
);
const CardContent = dynamic(() => import("@mui/material/CardContent"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const Stack = dynamic(() => import("@mui/material/Stack"));
const MyButton = dynamic(() =>
  import("@/ui/Buttons/MyButton/MyButton")
);

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((s) => s.profile);
  const { cartAddedItems } = useSelector((s) => s.cart);

  const handleAddToCart = () => {
    if (isLoggedIn) {
      dispatch(addToCart(item));
      dispatch(setToastifyType("success"));
      dispatch(setToastifyMsg("Added to cart"));
      dispatch(openToast(true));
    } else {
      dispatch(setToastifyType("error"));
      dispatch(setToastifyMsg("Please Login First"));
      dispatch(openToast(true));
    }
  };

  const handleRemoveFromCart = () => {
    if (isLoggedIn) {
      dispatch(removeFromCart(item));
      dispatch(setToastifyType("success"));
      dispatch(setToastifyMsg("Removed from cart"));
      dispatch(openToast(true));
    } else {
      dispatch(setToastifyType("error"));
      dispatch(setToastifyMsg("Please Login First"));
      dispatch(openToast(true));
    }
  };
  return (
    <ProductCardWrapper>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Image
          height={400}
          width={400}
          objectfit="contain"
          src={item?.image}
          alt={item?.title}
        />
      </Stack>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {item?.description}
        </Typography>
      </CardContent>

      {cartAddedItems[item?.id] ? (
        <MyButton
          startIcon={<DeleteIcon color="secondary" />}
          onClick={handleRemoveFromCart}
        >
          Remove from cart
        </MyButton>
      ) : (
        <MyButton startIcon={<AddShoppingCartIcon />} onClick={handleAddToCart}>
          Add to cart
        </MyButton>
      )}
    </ProductCardWrapper>
  );
}

ProductCard.propTypes = {
  item: shape({
    category: string,
    description: string,
    id: number,
    image: string,
    title: string,
    price: oneOfType([string,number]),
    rating: shape({
      rate: number,
      count: number,
    }),
  }),
};
