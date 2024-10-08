import React, { useEffect, useRef, useState } from "react";
import "./Modal.css";
import { useGlobalContext } from "../context/context";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../utils/Loading";
import Message from "../utils/Message";
import {
  addToCart,
  clearCart,
  decreaseCartQty,
  removefromcart,
} from "../redux/actions/cartActions";
import { createOrder } from "../redux/actions/orderActions";
import CameraInput from "../testComponents/CameraInput";

export default function CartModal() {
  const insideModalRef = useRef(null);
  const outsideModalRef = useRef(null);
  const dispatch = useDispatch();
  const { isCartOpen, closeCartModal } = useGlobalContext();

  const { cartItems } = useSelector((state) => state.cart);

  const { loading, error, success_create, table } = useSelector(
    (state) => state.orders
  );

  const [qrCodeError, setQrCodeError] = useState(false);

  // Memoize the handleCloseModal function
  const handleCloseModal = () => {
    closeCartModal();
    document.body.style.overflow = "auto";
    setQrCodeError(false);
  };

  const handleOutOfFocus = (ref) => {
    console.log(ref);
  };

  const [subTotal, setSubTotal] = useState(0);

  const handleCartQty = (id, qty, type) => {
    if (type === "dec") {
      if (qty === 1) {
        dispatch(removefromcart(id));
      }
      dispatch(decreaseCartQty(id));
    } else if (type === "inc") {
      dispatch(addToCart(id));
    }
  };

  const handleRemoveCartItem = (id) => {
    dispatch(removefromcart(id));
  };

  const handlePayOrder = () => {
    if (table === 0) {
      setQrCodeError(true);
    } else {
      dispatch(
        createOrder({
          order_items: cartItems,
          payment_method: "MPESA",
          customer_name: "Wamae",
          table_no: table,
          amount: subTotal,
        })
      );
    }
  };

  useEffect(() => {
    const totals = cartItems
      .reduce((itemA, itemB) => itemA + itemB?.quantity * itemB.price, 0)
      .toFixed(2);
    setSubTotal(totals);
  }, [cartItems]);

  useEffect(() => {
    if (success_create) {
      dispatch(clearCart());
    }
  }, [dispatch, success_create]);

  useEffect(() => {
    setQrCodeError(false);
  }, []);

  return (
    <div>
      {isCartOpen && (
        <div
          className='modal-overlay'
          ref={outsideModalRef}
          onClick={() => handleOutOfFocus(outsideModalRef)}
        >
          <div
            className='modal-content'
            ref={insideModalRef}
            onClick={() => handleOutOfFocus(insideModalRef)}
          >
            <h3 className='h3 text-gray-800 uppercase font-semibold my-2 text-center'>
              Your Cart
            </h3>
            {loading ? <Loading /> : error && <Message>{error}</Message>}
            {qrCodeError && <CameraInput />}
            <table className='min-w-full table-auto'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='py-2 px-2 text-left'></th>
                  <th className='py-2 px-2 text-left'>Item</th>
                  <th className='py-2 px-2 text-left'></th>
                  <th className='py-2 px-2 text-left'>Qty</th>
                  <th className='py-2 px-2 text-left'>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className='py-2 px-2'>
                      <div
                        className='border text-red-500 cursor-pointer rounded text-sm'
                        onClick={() => handleRemoveCartItem(item.id)}
                      >
                        <DeleteIcon />
                      </div>
                    </td>
                    <td className='py-2 px-2'>
                      <img
                        src={item.media_url}
                        alt=''
                        className='w-10 h-10 border object-cover'
                      />
                    </td>
                    <td className='py-2 px-2 text-sm'>{item.title}</td>
                    <td className='py-2 px-2 flex gap-2 justify-center items-center'>
                      <button
                        className='w-8 h-8 flex justify-center items-center border bg-slate-100 text-gray-700'
                        onClick={() =>
                          handleCartQty(item.id, item?.quantity, "dec")
                        }
                      >
                        -
                      </button>
                      <p className='text-sm'>{item?.quantity}</p>
                      <button
                        className='w-8 h-8 flex justify-center items-center border bg-slate-100 text-gray-700'
                        onClick={() =>
                          handleCartQty(item.id, item?.quantity, "inc")
                        }
                      >
                        +
                      </button>
                    </td>
                    <td className='py-2 px-2'>
                      {item?.quantity * item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='bg-white'>
                  <td className='py-2 px-4 font-semibold'></td>
                  <td className='py-2 px-4 font-semibold'></td>
                  <td className='py-2 px-4 font-semibold'></td>
                  <td className='py-2 px-4'>Subtotal</td>
                  <td className='py-2 px-4 font-semibold'>KES {subTotal}</td>
                </tr>
              </tfoot>
            </table>
            <div className='flex items-center justify-between'>
              <button className='btn-close' onClick={handleCloseModal}>
                Close
              </button>
              <button
                type='submit'
                className='bg-green-500 text-white h-10 uppercase'
                onClick={handlePayOrder}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
