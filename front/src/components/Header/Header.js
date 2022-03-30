import React, {useState} from "react";
import {navLinks} from "./data";
import Link from "next/link";
import {MapOutline, CloudUploadOutline, VideocamOutline, LogoGithub, GitBranch} from 'react-ionicons'

const serverTexts = {
    true: 'Servidor',
    false: 'Cliente',
    def: 'Error'
}

const segmentationTexts = {
    true: 'Instancia',
    false: 'Semántica',
    def: 'Error'
}

export default function Header({serverSwitch, setServerSwitch, segmentationSwitch, setSegmentationSwitch}) {
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
            <div className="header-nav-container">
                <nav className="header-nav">
                    {navLinks.map((link, index) => {
                        const CurIcon = icons[link.path];
                        return (
                            <Link key={index} href={link.path}>
                            <span className="header-nav-item text-no-select" key={index}><CurIcon
                                className="header-nav-icon"/>{link.name}</span>
                            </Link>
                        );
                    })}

                </nav>
                <div className="header-toggle-container">
                    <div className="header-toggle">
                        <label className="switch">
                            <input onChange={(e) => {
                                setServerSwitch(e.target.checked);
                            }} checked={serverSwitch} type="checkbox"/>
                            <span className="slider round"/>
                        </label>
                        <p id="switch-server">{serverTexts[serverSwitch] ?? serverTexts.def}</p>
                    </div>
                    <div className="header-toggle">
                        <label className="switch">
                            <input onChange={(e) => {
                                setSegmentationSwitch(e.target.checked);
                            }} checked={segmentationSwitch} type="checkbox"/>
                            <span className="slider round"/>
                        </label>
                        <p id="switch-segmentation">{segmentationTexts[segmentationSwitch] ?? segmentationTexts.def}</p>
                    </div>
                </div>
            </div>
            <Link href={'https://www.github.com'}>
                <span className="header-nav-item text-no-select"><LogoGithub className="header-nav-icon"/>GitHub</span>
            </Link>
        </header>
    )
        ;
}
