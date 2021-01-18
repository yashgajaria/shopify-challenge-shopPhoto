import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import "./Images.css";


export default function Images() {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [total, setTotal] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [refresh, setRefresh] = useState(true);


  useEffect(() => {

    async function onLoad() {
      try {

        var total=0;
        //Load information about user cart
        async function getInfo(){
          const cart = await API.get("getCart", `/getCart`);

          //If cart returns empty, exit
          if (cart==="empty"){
            setEmpty(true);
            return {};
          }
          //Iterate through the urls for the images
          Object.entries(cart).map(([index, info]) => {
            function getURL(){
              info.url= Storage.get(info.attachment);
            }
            getURL();
            total +=info.price;
            return;
          });
          return cart;
      }
        //Make sure all previous promises have returned
        let cart= await getInfo();
        for (let i=0; i< cart.length; i++){
          cart[i].urlstring= await cart[i].url;
        }

        setImage(cart);
        setTotal(total);
        setLoaded(true);
      } catch (e) {
        onError(e);
      }
      
    }

    onLoad();
  }, [id, refresh]);

  async function removeItem(item){
    //Call backend to remove image from User Cart 
    await API.post("removeCart", "/removeCart", {
      body: item
    });
    setRefresh(!refresh);

  }


  function renderFeed(images) {
    //Load images and needed data
    return Object.entries(images).map(([index, info]) => {
      return(
        <Fragment>
          <a href={`/images/${info.imageId}`}>
         <img src={info.urlstring} key={index} width="20%" height="20%" alt="item here"/>
         </a>
         <p>Item Description: {info.caption}</p>
         <button onClick={(e)=>removeItem(info.imageId)}>Remove</button>
         <p>Price: ${info.price} </p>
        </Fragment>
      );
    });
  }
  
  return (
    <div className="Images">
      {empty? <p>Your Cart is Empty. Add some pictures to your cart!</p>:
      (loaded?renderFeed(image):null)}
      <hr></hr>
      <p style={{"text-align":"right"}}><b>YOUR TOTAL (CAD &#x1f1e8;&#x1f1e6;): ${total} </b></p>
    </div>
  );
}