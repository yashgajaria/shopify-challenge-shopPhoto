import React, {  useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./Images.css";



export default function Images() {
  const { id } = useParams();
  const [inCart, setInCart] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function loadImage() {
      return API.get("images", `/images/${id}`);
    }

    async function onLoad() {
      try {
        //Load specific image
        const image = await loadImage();
        image.url= await Storage.get(image.attachment);
        setImage(image);
        setImageURL(image.url);

        //Check if item is already in User cart and set flag to not display add to cart button
        const user = await API.get("userGet", `/userGet`);

        Object.entries(user.cart).map(([index, info]) => {
          if (info === id){
            setInCart(true);
            return;
          }
        });
        setLoaded(true);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);
  
  async function AddCart(event) {
    event.preventDefault();

    //Add to user cart
    await API.post("addCart", "/addCart",{
      body: image.imageId
    });

    setInCart(true);
  }

  return (
    <div className="Images">
      {loaded?
      <Fragment>
       <img src={imageURL} width="50%" height="50%" alt="item here"/>
       <p>Image Description: {image.caption}</p>
       <p><b>Price(CAD &#x1f1e8;&#x1f1e6;): ${image.price} </b></p>
        {!inCart? <LoaderButton
            block
            bsSize="large"
            onClick={AddCart}
          >
            Add to Cart
          </LoaderButton> : <a href="/cart">Go To Cart</a>}
          </Fragment> : null}
    </div>
  );
}