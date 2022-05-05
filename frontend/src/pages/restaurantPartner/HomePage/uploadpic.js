const uploadpic = (pic, toast, setState) => {
  if (pic === undefined) {
    toast('Please Select an Image', {
      position: 'bottom-center',
      autoClose: 2000,
      closeOnClick: true
    })
    return
  }
  if (
    pic.type === 'image/jpeg' ||
    pic.type === 'image/png' ||
    pic.type === 'image/jpg'
  ) {
    const data = new FormData()
    data.append('file', pic)
    data.append('upload_preset', 'swiggy_clone')
    data.append('cloud_name', 'vivekgeekskool')
    fetch('https://api.cloudinary.com/v1_1/vivekgeekskool/image/upload', {
      method: 'post',
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setState(data.url.toString())
        console.log(data.url.toString())
        toast.success('Image uploaded successfully', {
          position: 'bottom-center',
          autoClose: 1000
        })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    toast.error('Please Select Image in jpg/jpeg/png format!', {
      position: 'bottom-center',
      status: 'warning',
      autoClose: 2000,
      closeOnClick: true
    })
    return
  }
}

export default uploadpic
