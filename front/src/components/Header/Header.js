import React from "react";
import { navLinks } from "./data";
import Link from "next/link";
import { MapOutline, CloudUploadOutline, LogoGithub, CodeSlashOutline } from 'react-ionicons'


export default function Header() {
  const icons = {
    '/map': MapOutline,
    '/photo': CloudUploadOutline,
    '/api-reference': CodeSlashOutline,
  }

  return (
    <header className="header-container">
      <div className="header-logo-container text-no-select">
        <span className="header-logo">Reconocimiento</span>
      </div>
      {navLinks.map((link, index) => {
        const CurIcon = icons[link.path];
        return (
          <Link key={index} href={link.path}>
            <a className="header-nav-item text-no-select" key={index}><CurIcon className="header-nav-icon" />{link.name}</a>
          </Link>
        );
      })}

      <Link href={'https://github.com/rubenbupe/proyectos-data'}>
        <a target="_blank" className="header-nav-item header-nav-right text-no-select"><LogoGithub className="header-nav-icon" />GitHub</a>
      </Link>
    </header>
  );
}
