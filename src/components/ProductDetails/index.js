import React, { Component } from "react";
import classes from "./ProductDetails.module.css";
import { withRouter } from "react-router-dom";
import { client } from "../../apolloClient";
import { ProductDocument } from "../../api/getProduct";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ProductDetails extends Component {
  state = {
    loading: false,
    error: false,
    product: null,
    selectedImage: null,
    selectedOption: null,
    count: 1,
  };

  async fetchProduct(productId) {
    try {
      this.setState({
        loading: true,
        error: false,
      });
      const result = await client.query({
        query: ProductDocument,
        variables: {
          id: productId,
        },
      });
      const product = result.data?.product;
      if (product) {
        const defaultSelectedAttributes = {};
        product?.attributes?.forEach((attribute) => {
          if (attribute) {
            defaultSelectedAttributes[attribute?.name] =
              attribute?.items?.[0]?.value;
          }
        });
        this.setState({
          product,
          selectedImage: product?.gallery?.[0],
          selectedOption: defaultSelectedAttributes,
        });
      }
    } catch (error) {
      this.setState({
        error: true,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidMount() {
    if (this.props?.match?.params?.productId) {
      const productId = this.props?.match?.params?.productId;
      this.fetchProduct(productId);
    }
  }

  selectImage = (imgUrl) => {
    this.setState({
      selectedImage: imgUrl,
    });
  };

  handleChange = (selectedOption, selectedValue) => {
    this.setState((prev) => ({
      ...prev,
      selectedOption: {
        ...prev.selectedOption,
        [selectedOption]: selectedValue,
      },
    }));
  };

  handleCount = (direction) => {
    if (this.state.count === 1 && direction === "-") {
      return;
    }
    this.setState((prev) => {
      return {
        ...prev,
        count: direction === "+" ? prev.count + 1 : prev.count - 1,
      };
    });
  };

  render() {
    const productId = this.props?.match?.params?.productId;
    const price = this.state.product?.prices?.find(
      (priceItem) => priceItem?.currency?.label === this.props.selectedCurrency
    );

    const notify = () =>
      toast(`${this.state.product?.name} added to the cart! ✅`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    const attributes = this.state?.product?.attributes;
    const arrHaveAttribute = this.state?.product?.attributes?.length !== 0;

    const buttonText = this.state?.product?.inStock
      ? "Add to cart"
      : "Out of stock";

    const buttonColor = this.state?.product?.inStock ? "" : "red";

    let generatedCartId = productId;
    if (this.state.selectedOption) {
      Object.values(this.state.selectedOption).forEach(
        (selectedOpt) => (generatedCartId += `.${selectedOpt}`)
      );
    }

    return (
      <div className={classes.details__wrapper}>
        <div className={classes.details__left}>
          <div className={classes.product__smallImgs}>
            {this.state.product?.gallery?.map((galleryItem) => (
              <img
                key={galleryItem}
                src={galleryItem}
                onClick={() => this.selectImage(galleryItem)}
                alt="product"
              />
            ))}
          </div>
          <img
            className={classes.product__mainImg}
            src={this.state.selectedImage}
            alt="product"
          />
        </div>

        <div className={classes.details__right}>
          <div className={classes.brand__name}>
            <p>
              {this.state.product?.name} {this.state.product?.brand}
            </p>
          </div>
          {arrHaveAttribute &&
            attributes?.map((attr) => {
              const isSwatch = attr?.type === "swatch";
              return (
                <div className={classes.size}>
                  <h4>{attr?.name}</h4>

                  <div className={classes.size__types}>
                    <ul>
                      {attr?.items?.map((obj) =>
                        isSwatch ? (
                          <li
                            onClick={() =>
                              this.handleChange(attr?.name, obj?.value)
                            }
                            id={classes.colors}
                            className={
                              this.state.selectedOption?.[attr.name] ===
                              obj?.value
                                ? classes.selected__border
                                : ""
                            }
                            style={{
                              backgroundColor: obj?.value,
                              border:
                                this.state.selectedOption?.[attr.name] ===
                                obj?.value
                                  ? "2px solid #06ee00"
                                  : "",
                              transform:
                                this.state.selectedOption?.[attr.name] ===
                                obj?.value
                                  ? "scale(1.3)"
                                  : "",
                            }}
                          ></li>
                        ) : (
                          <li
                            onClick={() =>
                              this.handleChange(attr?.name, obj?.value)
                            }
                            className={
                              this.state.selectedOption?.[attr.name] ===
                              obj?.value
                                ? classes.selected__background
                                : ""
                            }
                            style={{
                              backgroundColor:
                                this.state.selectedOption?.[attr.name] ===
                                obj?.value
                                  ? "#000"
                                  : "",
                              color:
                                this.state.selectedOption?.[attr.name] ===
                                obj?.value
                                  ? "#fff"
                                  : "",
                            }}
                          >
                            {obj?.value}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}

          <div className={classes.price}>
            <h4>Price:</h4>
            <span>
              {price?.currency?.symbol}
              {price?.amount}
            </span>
          </div>

          <div className={classes.quantity}>
            <h4>Quantity:</h4>
            <div>
              <span onClick={() => this.handleCount("-")}>-</span>
              <span>{this.state.count}</span>
              <span onClick={() => this.handleCount("+")}>+</span>
            </div>
          </div>

          <button
            onClick={() => {
              this.props.editItem(
                {
                  ...this.state.product,
                  generatedCartId,
                  selectedOption: this.state.selectedOption,
                },
                this.state.count
              );
              notify();
            }}
            style={{ backgroundColor: buttonColor }}
            disabled={!this.state.product?.inStock}
          >
            {buttonText}
          </button>
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
            style={{ marginTop: "2.5em", marginRight: "1em" }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: this.state.product?.description,
            }}
          />
        </div>
      </div>
    );
  }
}

export const ProductDetailsWithRouter = withRouter(ProductDetails);
