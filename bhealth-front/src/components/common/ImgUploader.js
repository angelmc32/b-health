import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

const ImgUploader = ({ handleFileInput, form, preview = true }) => {

  const [pictures, setPictures] = useState([]);

  const onDrop = (event, picture) => {
    setPictures([...pictures, picture]);
  }

  return (
    <ImageUploader
      name="image"
      buttonClassName="uk-button uk-button-muted uk-border-pill"
      withPreview={preview}
      withIcon={false}
      withLabel={false}
      buttonText='Escoger imagen'
      onChange={onDrop}
      imgExtension={['.jpg', '.gif', '.png', '.gif']}
      maxFileSize={5242880}
      fileSizeError="El archivo debe ser menor a 10 MB"
      fileTypeError="El archivo debe ser de extensión .jpg, .png o .pdf"
    />
  )
}

export default ImgUploader