import React, { useContext, useState, useRef } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [rawImgSrc, setRawImgSrc] = useState(null)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState(null)
    const [showCropper, setShowCropper] = useState(false)
    const imgRef = useRef(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onImageSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setRawImgSrc(reader.result)
            setShowCropper(true)
        }
        reader.readAsDataURL(file)
    }

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget
        const crop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 3 / 4, width, height),
            width,
            height
        )
        setCrop(crop)
    }

    const getCroppedFile = () => {
        return new Promise((resolve) => {
            const image = imgRef.current
            const canvas = document.createElement('canvas')
            const scaleX = image.naturalWidth / image.width
            const scaleY = image.naturalHeight / image.height
            canvas.width = completedCrop.width * scaleX
            canvas.height = completedCrop.height * scaleY
            const ctx = canvas.getContext('2d')
            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0, 0,
                canvas.width,
                canvas.height
            )
            canvas.toBlob((blob) => {
                resolve(new File([blob], 'doctor.jpg', { type: 'image/jpeg' }))
            }, 'image/jpeg', 0.9)
        })
    }

    const confirmCrop = async () => {
        if (!completedCrop) return toast.error('Please select a crop area')
        const croppedFile = await getCroppedFile()
        setDocImg(croppedFile)
        setShowCropper(false)
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (!docImg) return toast.error('Image Not Selected')

            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    return (
        <>
            {/* Crop Modal */}
            {showCropper && (
                <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center'>
                    <div className='bg-white rounded-xl p-6 max-w-lg w-full mx-4'>
                        <p className='text-lg font-medium mb-1'>Crop Doctor Image</p>
                        <p className='text-sm text-gray-400 mb-4'>Adjust the crop to a 3:4 portrait ratio</p>
                        <div className='max-h-[60vh] overflow-auto flex justify-center'>
                            <ReactCrop
                                crop={crop}
                                onChange={c => setCrop(c)}
                                onComplete={c => setCompletedCrop(c)}
                                aspect={3 / 4}
                            >
                                <img ref={imgRef} src={rawImgSrc} onLoad={onImageLoad} className='max-w-full' alt='crop-preview' />
                            </ReactCrop>
                        </div>
                        <div className='flex gap-3 mt-4 justify-end'>
                            <button onClick={() => setShowCropper(false)} className='px-5 py-2 border rounded-full text-sm text-gray-600'>Cancel</button>
                            <button onClick={confirmCrop} className='px-5 py-2 bg-primary text-white rounded-full text-sm'>Confirm Crop</button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={onSubmitHandler} className='m-5 w-full'>
                <p className='mb-3 text-lg font-medium'>Add Doctor</p>

                <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                    <div className='flex items-center gap-4 mb-8 text-gray-500'>
                        <label htmlFor="doc-img" className='cursor-pointer'>
                            <img
                                className='w-16 h-16 rounded-full object-cover object-top bg-gray-100'
                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                                alt=""
                            />
                        </label>
                        <input onChange={onImageSelect} type="file" accept="image/*" id="doc-img" hidden />
                        <p>Upload doctor <br /> picture</p>
                    </div>

                    <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Your name</p>
                                <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                            </div>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Doctor Email</p>
                                <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                            </div>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Set Password</p>
                                <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                            </div>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Experience</p>
                                <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2'>
                                    <option value="1 Year">1 Year</option>
                                    <option value="2 Year">2 Years</option>
                                    <option value="3 Year">3 Years</option>
                                    <option value="4 Year">4 Years</option>
                                    <option value="5 Year">5 Years</option>
                                    <option value="6 Year">6 Years</option>
                                    <option value="8 Year">8 Years</option>
                                    <option value="9 Year">9 Years</option>
                                    <option value="10 Year">10 Years</option>
                                </select>
                            </div>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Fees</p>
                                <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Doctor fees' required />
                            </div>
                        </div>

                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Speciality</p>
                                <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                    <option value="General physician">General physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatricians">Pediatricians</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Gastroenterologist">Gastroenterologist</option>
                                </select>
                            </div>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Degree</p>
                                <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                            </div>
                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Address</p>
                                <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                                <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className='mt-4 mb-2'>About Doctor</p>
                        <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about doctor'></textarea>
                    </div>

                    <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>
                </div>
            </form>
        </>
    )
}

export default AddDoctor
