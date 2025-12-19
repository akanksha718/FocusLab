import React from 'react'

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4' >
      <div className='text-center'>
         <h1 className='text-6xl font-bold text-red-500'>404</h1>
         <h2 className='text-2xl font-semibold mt-4 mb-2'>Page Not Found</h2>
         <p className='text-gray-600 mb-6'>Oops! The page you're looking for doesn't exist</p>
      </div>
    </div>
  )
}

export default NotFound