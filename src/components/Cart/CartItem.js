import React, { Component, Fragment } from "react";
import classes from "./Cart.module.css";
import remove from "../../remove.png";
import leftArrow from "../../left.svg";
import rightArrow from "../../right.svg";

export default class CartItem extends Component {
  state = {
    counter: 0,
  };

  slideImg = (direction) => {
    if (
      this.state.counter === this.props.cartItem?.gallery?.length - 1 &&
      direction === "+"
    ) {
      this.setState((prev) => {
        return {
          counter: 0,
        };
      });
    } else if (this.state.counter === 0 && direction === "-") {
      this.setState((prev) => {
        return {
          counter: this.props.cartItem?.gallery?.length - 1,
        };
      });
    } else {
      this.setState((prev) => {
        return {
          counter: direction === "+" ? prev.counter + 1 : prev.counter - 1,
        };
      });
    }
  };

  render() {
    const renderSelectedOption = (cartItem) => {
      return (
        <ul className={`${classes.item__sizes} ${classes.size__types}`}>
          {Object.keys(cartItem?.selectedOption).map((item) => {
            switch (item) {
              case "Size":
                return (
                  <li>
                    <p>{item}:</p>
                    <p>{cartItem.selectedOption[item]}</p>
                  </li>
                );

              case "Color":
                return (
                  <li>
                    <p>{item}:</p>
                    <p
                      id={classes.selectedColor}
                      style={{ backgroundColor: cartItem.selectedOption[item] }}
                    ></p>
                  </li>
                );

              default:
                return (
                  <li>
                    <p>{item}:</p>
                    <p>{cartItem.selectedOption[item]}</p>
                  </li>
                );
            }
          })}
        </ul>
      );
    };

    const removeItem = (cartItem) => {
      const count = cartItem.count;
      this.props.editItem(cartItem, -count);
    };

    const { price, cartItem } = this.props;

    return (
      <Fragment key={cartItem.id}>
        <div className={classes.item__row}>
          <div className={classes.item__left}>
            <p className={classes.item__name}>
              {cartItem.brand} {cartItem.name}
            </p>
            <div className={classes.item__price}>
              {price?.currency?.symbol} {price?.amount}
            </div>
            {renderSelectedOption(cartItem)}
          </div>
          <div className={classes.item__right}>
            <div className={classes.item__counter}>
              <button onClick={() => this.props.editItem(cartItem, 1)}>
                +
              </button>
              <div>{cartItem.count}</div>
              <button onClick={() => this.props.editItem(cartItem, -1)}>
                -
              </button>
              <img
                className={classes.removeBtn}
                src={remove}
                onClick={() => removeItem(cartItem)}
              ></img>
            </div>
            <div className={classes.item__image}>
              <img
                alt={cartItem.name}
                src={cartItem?.gallery?.[this.state.counter]}
              />
              <div className={classes.arrows__container}>
                <div onClick={() => this.slideImg("-")}>
                  <img src={leftArrow} />
                </div>
                <div onClick={() => this.slideImg("+")}>
                  <img src={rightArrow} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </Fragment>
    );
  }
}
