import AddProductForm from '@/components/AddProductForm'
import React from 'react'

export default function page() {
    return (
        <div>
            <h1 className='font-bold text-3xl text-center my-2'>Add New Product</h1>
            <AddProductForm />
        </div>
    )
}
