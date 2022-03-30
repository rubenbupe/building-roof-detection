import React from "react";
import Link from "next/link";
import wave1 from '../../../assets/border-img/1.png';
import wave2 from '../../../assets/border-img/2.png';
import wave3 from '../../../assets/border-img/3.png';

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-line footer-line-1">
        <div className="footer-wave footer-wave-1" style={{backgroundImage: `url(${wave1.src})`}}/>
      </div>
      <div className="footer-line footer-line-2">
        <div className="footer-wave footer-wave-2" style={{backgroundImage: `url(${wave2.src})`}}/>
      </div>
      <div className="footer-line footer-line-3">
        <div className="footer-wave footer-wave-3" style={{backgroundImage: `url(${wave3.src})`}}/>
      </div>
    </div>
  );
}
