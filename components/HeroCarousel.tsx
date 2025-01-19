"use client"
import Image from "next/image"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const heroImages = [
  { url: "/assets/images/hero-1.svg", alt: "smartwatch" },
  { url: "/assets/images/hero-2.svg", alt: "bag" },
  { url: "/assets/images/hero-3.svg", alt: "lamp" },
  { url: "/assets/images/hero-4.svg", alt: "air fryer" },
  { url: "/assets/images/hero-5.svg", alt: "chair" },
]

function HeroCarousel() {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={2000}
        showStatus={false}
        showArrows={false}
      >
        {heroImages.map((image) => (
          <Image
            key={image.alt}
            alt={image.alt}
            src={image.url}
            width={484}
            height={484}
            className="obect-contain"
          />
        ))}
      </Carousel>
      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="hand-drawn-arrow"
        width={175}
        height={175}
        className="absolute bottom-0 -left-[15%] max-xl:hidden z-0"
      />
    </div>
  )
}

export default HeroCarousel
