import React from 'react'
import './App.css'
import { useLocation, useRoute } from 'wouter'

const NavBar = () => {
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()

  return (
    <>
      <div className="alwaysVisible">
        <a onClick={() => setLocation('/')} className="navBack">
          {params ? '< back' : 'double click to enter portal'}
        </a>
        <div className="navName">
          <a href="https://github.com/StarrLikeRingo22/">aabdelgadir<br />junior dev</a>
        </div>

        <div className={`navLine ${params ? 'hidden' : ''}`} />
      </div>

      <div className={`footer ${params ? 'hidden' : ''}`}>
        <div className="footerLine" />
        <div className="footerContent">
          <a href="/Attributions">Attributions</a>
          <div className="footerDate">07/05/2025</div>
        </div>
      </div>
    </>
  )
}

export default NavBar
