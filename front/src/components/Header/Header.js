import React from "react";
import {navLinks} from "./data";
import Link from "next/link";
import {MapOutline, CloudUploadOutline, VideocamOutline, LogoGithub, GitBranch} from 'react-ionicons'


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
                            <input type="checkbox"/>
                            <span className="slider round"/>
                        </label>
                        <p id="switch-server">Servidor</p>
                    </div>
                    <div className="header-toggle">
                        <label className="switch">
                            <input type="checkbox"/>
                            <span className="slider round"/>
                        </label>
                        <p id="switch-segmentation">Instancia</p>
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
