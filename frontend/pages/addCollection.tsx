import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'
import Link from "next/link";

type PageProps = {    
    collections: {
        address: string,
        name: string,
        desc: string,
        profileImage: string,
        floorPrice: number
    }[];
}

const addCollection = () => {
  return (
    <MainLayout>
        <h1 className="flex justify-center text-4xl">Fill the form to add an existing collection</h1>
        <form className="min-w-[50vw] m-auto my-5">
        <div className="flex flex-col">
          <label>Name:</label>
          <input
            name="name"
            type="text"
            // onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Name"
            // value={formData.name}
          ></input>
        </div>
        {/* <button onClick={handleSubmit}>Actualizar</button> */}
      </form>
    </MainLayout>
  )
}

export default addCollection;