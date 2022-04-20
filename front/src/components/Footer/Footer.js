import React from "react";
import Link from "next/link";
const wave1 = 'images/border-img/1.png';
const wave2 = 'images/border-img/2.png';
const wave3 = 'images/border-img/3.png';

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-line footer-line-1">
        <div className="footer-wave footer-wave-1" style={{backgroundImage: `url(${wave1})`}}/>
      </div>
      <div className="footer-line footer-line-2">
        <div className="footer-wave footer-wave-2" style={{backgroundImage: `url(${wave2})`}}/>
      </div>
      <div className="footer-line footer-line-3">
        <div className="footer-wave footer-wave-3" style={{backgroundImage: `url(${wave3})`}}/>
      </div>
    </div>
  );
}