import React from 'react';

// import './navbar.css'

export default function Navbar() {
  return (
    <div className='absolute w-full border-t-4 border-purple-500 bg-black '>
      <div className='border-b border-black-300'>
        <div className='flex max-w-6xl mx-auto'>
          <span className='py-4 px-4 text-2xl font-semibold text-purple-500'>
            Endereçador - Serviço de Mensageria
          </span>
        </div>
      </div>
    </div>
  );
}
