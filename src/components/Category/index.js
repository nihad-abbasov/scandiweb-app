import React, { Component } from "react";
import ProductItem from "../ProductItem";
import classes from "./Category.module.css";
import { withRouter } from "react-router-dom";

class CategoryComponent extends Component {
  render() {
    return (
      <div className={classes.wrapper}>
        <h2 className={classes.heading}>{this.props.name}</h2>

        <div className={classes.gallery__container}>
          {this.props.products?.map((product) => (
            <ProductItem
              key={product.id}
              name={product.name}
              imgUrl={product.gallery?.[0]}
              prices={product.prices}
              // handleClick={() =>
              //   product.inStock &&
              //   this.props.history.push(`/details/${product.id}`)
              // }
              handleClick={() =>
                this.props.history.push(`/details/${product.id}`)
              }
              selectedCurrency={this.props.selectedCurrency}
              inStock={product.inStock}
              brand={product.brand}
            />
          ))}
        </div>
      </div>
    );
  }
}

export const Category = withRouter(CategoryComponent);
