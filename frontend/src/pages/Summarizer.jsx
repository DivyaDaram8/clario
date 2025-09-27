import React from 'react'
import NavbarLeft from '../layout/NavbarLeft';
import NavbarTop from '../layout/NavbarTop';

function Summarizer() {
  return (
    <div>
      <div className="fixed top-0 left-0 h-full w-64 z-20"><NavbarLeft /></div>
      <div className="fixed top-0 left-64 right-0 h-16 z-20"><NavbarTop /></div>
      <p>Summarizer</p>
    </div>
  )
}

export default Summarizer;