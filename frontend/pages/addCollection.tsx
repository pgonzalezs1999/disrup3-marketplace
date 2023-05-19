import CustomButton from '@/components/CustomButton';
import MainLayout from '@/components/layouts/MainLayout'
import React, { useState, useEffect, ChangeEvent } from 'react'

const addCollection = () => {
  const [validFormData, setValidFormData] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await fetch("/api/collection/addCollection", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateForm = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setValidFormData(false);
    if(formData.address) {
      formData.address = formData.address.toLowerCase();
      if(formData.address.length === 42) {
        if(formData.address[0] == "0" && formData.address[1] == "x") {
          if(formData.name) {
            setValidFormData(true);
          }
        }
      }
    }
  }, [formData]);

  return (
    <MainLayout>
        <h1 className="flex justify-center text-4xl w-[80vw] m-auto mt-3">Fill the form to add an existing collection</h1>
        <form className="min-w-[50vw] m-auto my-5 flex flex-col items-center">
        <div className="flex flex-col">
          <label>Collection address:</label>
          <input
            name="address"
            type="text"
            onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Collection address"
            value={formData.address}
          ></input>
          <label>Name:</label>
          <input
            name="name"
            type="text"
            onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Collection name"
            value={formData.name}
          ></input>
        </div>
        {
          (validFormData == true)
          ? <CustomButton onClick={handleSubmit}>Actualizar</CustomButton>
          : <CustomButton>Invalid form data</CustomButton>
        }
      </form>
    </MainLayout>
  )
}

export default addCollection;