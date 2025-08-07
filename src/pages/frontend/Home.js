import { Carousel } from "react-bootstrap";
import banner1 from "../../assets/Logo/banner1.webp";
import  ProductNew  from "../frontend/Product/ProductNew"
import  ProductHot  from "../frontend/Product/ProductHot"
import  ProductSale  from "../frontend/Product/ProductSale"


const Home = () => {
  return (
    <div>
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner1}
          alt="Banner 1"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner1}
          alt="Banner 1"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner1}
          alt="Banner 1"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
      </Carousel.Item>
    </Carousel>
    
      <ProductNew />
      <ProductHot />
      <ProductSale />

    </div>
  );
};

export default Home;
