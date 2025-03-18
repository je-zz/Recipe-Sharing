import Carousel from 'react-bootstrap/Carousel';
import shared from '../assets/share.jpg';
import loved from '../assets/loved.jpg';
import upload from '../assets/upload.jpg';
import '../Style.css' // Import the CSS file

function ImageCarousel() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img className="carousel-image d-block" src={upload} alt="First slide" />
        <Carousel.Caption>
          <p>Upload your favorite recipes.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="carousel-image d-block" src={loved} alt="Second slide" />
        <Carousel.Caption>
          <p>Prepare food with loved ones.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="carousel-image d-block" src={shared} alt="Third slide" />
        <Carousel.Caption>
          <p>Share recipes with your friends.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageCarousel;
