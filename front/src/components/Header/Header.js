import React from "react";
import { navLinks } from "./data";
import Link from "next/link";
import { MapOutline, CloudUploadOutline, VideocamOutline, LogoGithub, GitBranch } from 'react-ionicons'


export default function Header() {
  const icons = {
    '/map': MapOutline,
    '/photo': CloudUploadOutline,
    '/video': VideocamOutline,
  }

  return (
    <header className="header-container">
      <div className="header-logo-container text-no-select">
        <span className="header-logo">Reconocimiento</span>
      </div>
      <nav className="header-nav">
        {navLinks.map((link, index) => {
          const CurIcon = icons[link.path];
          return (
            <Link key={index} href={link.path}>
              <span className="header-nav-item text-no-select" key={index}><CurIcon className="header-nav-icon" />{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <Link href={'https://www.github.com'}>
        <span className="header-nav-item text-no-select"><LogoGithub className="header-nav-icon" />GitHub</span>
      </Link>
    </header>
  );
}
