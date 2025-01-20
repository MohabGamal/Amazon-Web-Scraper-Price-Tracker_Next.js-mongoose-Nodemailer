import Image from "next/image"
import Link from "next/link"
import React from "react"

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
  { src: "/assets/icons/user.svg", alt: "user" },
]

function Navbar() {
  return (
 
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.ico"
            alt="logo"
            width={27}
            height={27}
          />
          <p className="nav-logo">
            Amazon<span className="text-primary">Tracker</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
              className="obejct-contain"
            />
          ))}
        </div>
      </nav>
   
  )
}

export default Navbar
