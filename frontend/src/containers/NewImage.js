import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewImage.css";
import { s3Upload } from "../libs/awsLib";
import { API } from "aws-amplify";

export default function NewNote() {
  const file = useRef(null);
  const history = useHistory();
  const [caption, setCaption] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");


  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (alert) setAlert(false);

  //Validate file type and that a file is uploaded
  try{
    if (!(file.current.type.includes("jpeg") || file.current.type.includes("jpg") || file.current.type.includes("png") || file.current.type.includes("gif"))){
      setAlert(true);
      setMessage("Uploaded file type not supported, only jpeg, png, and gif file types are supported");
      return;
    }
  }
  catch(e){
    setAlert(true);
    setMessage("Please upload an image to continue");
    return;
  }
    //Validate price is included
    if (price.length <=0 ){
      setAlert(true);
      setMessage("Please enter a valid number as a price");
      return;
    }
    //Validate file size
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      setAlert(true);
      setMessage(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    //Upload image to S3 Bucket and update backend API to create DB entry
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
  
      await createImage({ caption, price, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  
  function createImage(image) {
    return API.post("imageCreate", "/imageCreate", {
      body: image
    });
  }
  return (
    <div className="NewImage">
      <form onSubmit={handleSubmit}>
        <p>Caption:</p>
        <FormGroup controlId="caption">
          <FormControl
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
        </FormGroup>
        <p>Price (CAD &#x1f1e8;&#x1f1e6;): </p>
        <FormGroup controlId="price">
          <FormControl
            value={price}
            type="number"
            onChange={e => setPrice(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          // disabled={!validateForm()}
        >
          Create
        </LoaderButton>
        {alert? <p>{message}</p>: null}
      </form>
    </div>
  );
}