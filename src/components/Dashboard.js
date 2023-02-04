import { Canvas } from '@react-three/fiber'

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/appContext'
import '../App.css'
import Box from './Box'
import html2canvas from 'html2canvas'
import axios from 'axios'
// MAIN PROBLEM IS THAT SETIMAGE TAKES TIME TO SET THE LINK. SO CANNOT AXIOS.POST . HOW DO I AXIOS.POST ONLY WHEN THE STATE HAS BEEN SET

export const Dashboard = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const { test } = useAppContext()
  const [gallery, setGallery] = useState([])

  function reset() {
    setImage('')
    setName('')
    setDescription('')
  }

  useEffect(() => {
    fetchImages()
    if (name === '' || description === '' || image === '') {
      return
    } else
      try {
        // const uploadedImage = {
        //   name: name,
        //   description: description,
        //   image: image,
        // }

        // axios.post(
        //   `https://createimages-server.vercel.app/api/v1/images`,
        //   uploadedImage
        // )
        // reset()

        fetchImages()
      } catch (error) {
        console.log(error)
      }
  }, [image])

  // fetchImages
  const fetchImages = async () => {
    const {
      data: { Images },
    } = await axios.get(`https://createimages-server.vercel.app/api/v1/images`)
    setGallery(Images)
  }

  //DownloadImage Function
  const handleSubmit = (e) => {
    // -- function that converts base64 to image file
    const dataURLtoFile = (dataurl, filename) => {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1)
        n -= 1 // to make eslint happy
      }
      return new File([u8arr], filename, { type: mime })
    }

    // -- Select canvas element

    const screenshotTarget = document.getElementById('canvas')
    // -- Use html2canvas to convert to base 64 image
    html2canvas(screenshotTarget).then((canvas) => {
      const base64image = canvas.toDataURL('image/png')

      // -- Upload Function ( Converts base64 image to image file before uploading to cloudinary)

      const uploadToCloud = async () => {
        let file = dataURLtoFile(base64image)
        let formData = new FormData()
        formData.append('image', file, file.name)

        if (name === '' || description === '') {
          console.log('please give a name and desc')
        } else
          try {
            let {
              data: {
                image: { src },
              },
            } = await axios.post(
              `https://createimages-server.vercel.app/api/v1/images/uploads`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            )

            // problem is that setImage is asynchronous. So axios.post is invoked before setImage is set, therefore upload a null value

            setImage(src)
          } catch (error) {
            console.log(error)
          }
      }

      uploadToCloud()
    })
  }

  //handleSubmit Function

  //handleChange function
  const handleChange = async (e) => {
    const imageFile = e.target.files[0]
    const formData = new FormData()
    formData.append('image', imageFile)

    console.log(formData)
    console.log(Array.from(formData))

    try {
      const {
        data: {
          image: { src },
        },
      } = await axios.post(
        `https://createimages-server.vercel.app/api/v1/images/uploads`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      setImage(src)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='App' id='canvas'>
        <Canvas gl={{ preserveDrawingBuffer: true }}>
          <Box />
        </Canvas>
      </div>

      <form
        className='form file-form'
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <h4>File Upload</h4>

        <div className='form-row'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input
            type='text'
            id='name'
            className='form-input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='form-row'>
          <label htmlFor='description' className='form-label'>
            Description
          </label>
          <input
            type='text'
            id='description'
            className='form-input'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </form>

      <div>
        {/* <button onClick={() => uploadImage()}>Confirm</button> */}
        <br />
        <button onClick={(e) => handleSubmit(e)}>Capture</button>
      </div>

      <div>
        <h1>Gallery</h1>

        {gallery &&
          gallery.map((item) => {
            return (
              <div key={item._id}>
                <h1>{`${item.name}`}</h1>
                <p>{`${item.description}`}</p>
                <img src={`${item.image}`}></img>
              </div>
            )
          })}
      </div>
    </>
  )
}
