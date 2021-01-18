import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API, Storage } from "aws-amplify";
import "./Home.css";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../components/logo.jpg";


export default function Home() {
  const [images, setImages] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        var images = await loadImages();

        var attachments=[];
        //Create an Array of all Image URLs
        Object.entries(images).map(([index, info]) => {
          attachments.push(info.attachment);
          async function getURL(){
            info.url= await Storage.get(info.attachment);
          }
          getURL();
        });
        var x="";
        var attachmentURLs=[];
        for (x in attachments){
          let url = await Storage.get(attachments[x]);
          attachmentURLs.push(url);
        }
        setImages(images);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadImages() {
    return API.get("getImage", "/getImage");
  }
  function renderFeed(images) {

    return Object.entries(images).map(([index, info]) => {
      return(
          <a href={`/images/${info.imageId}`} key={index}>
         <img src={info.url} key={index} width="20%" height="20%" alt="item here"/>
         </a>
       
      );
    });
  

  }

  function renderLander() {
    return (
      <div className="lander">
        <img src={logo} width="30%" height="30%" alt="logo"></img> 
        <h1>shopPhoto</h1>
        <p>Buy and Sell Images Online</p>
      </div>
    );
  }

  function renderImages() {
    return (
      <div className="images">
        <PageHeader><img src={logo} width="5%" height="5%" alt="logo"></img> Images Available</PageHeader>
         {isAuthenticated? <LinkContainer key="new" to="/images/new">
           <ListGroupItem>
             <h4>
              <b>{"\uFF0B"}</b> Sell an Image
             </h4>
           </ListGroupItem>
         </LinkContainer> : null}
        <ListGroup>
          {!isLoading && renderFeed(images)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderImages() : renderLander()}
    </div>
  );
}