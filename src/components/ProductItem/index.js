import React, { Component } from "react";
import classes from "../Category/Category.module.css";
import shopping from "../../shopping-cart-white.png";

export default class ProductItem extends Component {
  render() {
    const price = this.props.prices?.find(
      (priceItem) => priceItem?.currency?.label === this.props.selectedCurrency
    );

    return (
      <div className={classes.product__wrapper}>
        <div
          className={`${classes.gallery__item} ${
            !this.props.inStock && classes.lowOpacity
          }`}
          onClick={this.props.handleClick}
        >
          <div>
            <img className={classes.item__image} src={this.props.imgUrl} />
            {this.props.inStock && (
              <span className={classes.basket__onHover}>
                <img src={shopping} />
              </span>
            )}
          </div>
          <p className={classes.item__name}>
            <span>{this.props.brand}</span>
            <span>{this.props.name}</span>
            {/* <span className="item__type">Running Short</span> */}
          </p>
          <div className={classes.item__price}>
            {price?.currency?.symbol}
            {price?.amount}
          </div>
        </div>
        {!this.props.inStock && <span>Out of Stock</span>}
      </div>
    );
  }
}
