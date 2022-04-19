import React, { useState } from "react";
import { navLinks } from "./data";
import Link from "next/link";
import { MapOutline, CloudUploadOutline, LogoGithub, CodeSlashOutline } from 'react-ionicons'
import {toggle} from "ionicons/icons";

const app_logo = 'images/logos/logo.png';

const serverTexts = {
  true: 'Servidor', false: 'Cliente', def: 'Error',
}

const segmentationTexts = {
  true: 'Instancia', false: 'Semántica', def: 'Error',
}

export default function Header({ serverSwitch, setServerSwitch, segmentationSwitch, setSegmentationSwitch, toggleSwitch }) {
  const icons = {
    '/map': MapOutline,
    '/photo': CloudUploadOutline,
    '/api-reference': CodeSlashOutline,
  }

  return (
    <header className="header-container">
      <div className="header-logo-container text-no-select">
        <img className="header-logo" src={`${app_logo}`}/>
        <div className="header-logo-text-container">
          <span className="header-logo-text"><strong>Re</strong>conocimiento</span>
          <span className="header-logo-subtext">del <strong>Me</strong>dio</span>
        </div>
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
        <a target="_blank" className="header-nav-item text-no-select"><LogoGithub className="header-nav-icon" />GitHub</a>
      </Link>

      {toggleSwitch && (<>
      <div className="header-toggle header-nav-right">
        <label className="switch">
          <input onChange={(e) => {
            setServerSwitch(e.target.checked);
          }} checked={serverSwitch} type="checkbox" />
          <span className="slider round" />
        </label>
        <span className="switch-label" id="switch-server">{serverTexts[serverSwitch] ?? serverTexts.def}</span>
      </div>

      <div className="header-toggle">
        <label className="switch">
          <input onChange={(e) => {
            setSegmentationSwitch(e.target.checked);
          }} checked={segmentationSwitch} type="checkbox" />
          <span className="slider round" />
        </label>
        <span className="switch-label" id="switch-segmentation">{segmentationTexts[segmentationSwitch] ?? segmentationTexts.def}</span>
      </div>
      </>)}
    </header>
  );
}
