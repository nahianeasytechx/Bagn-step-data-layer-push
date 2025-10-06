import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className='py-10 flex justify-center mx-auto'>
        <Image src={'https://res.cloudinary.com/da4l4bhhn/image/upload/v1745682388/WalkerLifestyle-size-chart_lcratz.jpg'} width={800} height={800}  alt='size chart' className=''></Image>
    </div>
  )
}
