import React, { Component, Fragment } from "react";
import classes from "./Cart.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import remove from "../../remove.png";
import CartItem from "./CartItem";

export default class Cart extends Component {
  render() {
    const total = this.props.cart?.reduce((cartTotal, cartItem) => {
      const price = cartItem?.prices?.find(
        (priceItem) =>
          priceItem?.currency?.label === this.props.selectedCurrency
      );
      cartTotal += cartItem.count * price?.amount;
      return cartTotal;
    }, 0);

    const notify = () =>
      toast(`Your order has been submitted! 😎`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    const tax = (total * 21) / 100;

    const totalWithTax = tax + total;

    return (
      <div className={classes.cart}>
        <div className={classes.wrapper}>
          <h2 className={classes.heading}>Cart</h2>
          <div className={classes.all__products}>
            <hr />
            {this.props.cart.length ? (
              this.props.cart.map((cartItem) => {
                const price = cartItem?.prices?.find(
                  (priceItem) =>
                    priceItem?.currency?.label === this.props.selectedCurrency
                );

                return (
                  <CartItem
                    price={price}
                    cartItem={cartItem}
                    editItem={this.props.editItem}
                  />
                );
              })
            ) : (
              <h2 className={classes.emptyCard__message}>Your cart is empty</h2>
            )}
          </div>
          {!!this.props.cart.length && (
            <div className={classes.cart__bottom}>
              <div>
                <span>Tax 21%:</span>
                <span>
                  {this.props.selectedCurrency} {tax.toFixed(2)}
                </span>
              </div>
              <div>
                <span>Quantity:</span>
                <span>{this.props.cart.length}</span>
              </div>
              <div>
                <span>Total:</span>
                <span>
                  {this.props.selectedCurrency} {totalWithTax.toFixed(2)}
                </span>
              </div>
              <button onClick={() => notify()}>Order</button>
              <ToastContainer
                position="top-center"
                autoClose={800}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={5}
                // style={{ marginTop: "2.5em", marginRight: "1em" }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
