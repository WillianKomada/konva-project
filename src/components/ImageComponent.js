import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

export function ImageComponent() {
  const [image, setImage] = useState();

  useEffect(() => {
    const img = new window.Image();
    img.src =
      "https://d2slcw3kip6qmk.cloudfront.net/marketing/pages/i18n/pt/Planta_de_Apartamento.png";
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return (
    <React.Fragment>
      <Image image={image} width={1200} height={750} x={100} y={20} />
    </React.Fragment>
  );
}
