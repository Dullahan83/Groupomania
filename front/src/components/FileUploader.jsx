import React from 'react'
import './FileUploader.scss'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
function FileUploader(props) {
  const hiddenFileInput = React.useRef(null)
  function handleClick(e) {
    e.preventDefault()
    hiddenFileInput.current.click()
  }
  function handleChange(e) {
    const fileUploaded = e.target.files[0]
    props.handleFile(fileUploaded)
  }
  return (
    <>
      <button onClick={handleClick} className={props.classname}>
        <AttachmentOutlinedIcon className="fileIcon" />
      </button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        className="hideFileInput"
      />
    </>
  )
}

export default FileUploader
