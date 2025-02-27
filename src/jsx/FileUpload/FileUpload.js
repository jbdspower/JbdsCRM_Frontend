import React, { useState } from "react";
import './upload.css'

const FileUpload = ({ fileName1, files, setFiles }) => {
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [labelColor, setLabelColor] = useState("grey");
  const [iconClass, setIconClass] = useState("fa fa-paperclip");
  const [borderColor, setBorderColor] = useState("2px dashed grey");

  const getFileName = (name) => {
    const all = [...files]
    if (all.length > 0) {
      const file = all.find(x => x.name.startsWith(name));
      if (file) {
        let fileName = file.name;
        fileName = fileName.split('_');
        fileName = name + "_" + (parseInt(fileName[1]) + 1)
        return fileName
      }
      return name + "_1"
    } else {
      return name + "_1"
    }

  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFileName = file.name;
      const extension = newFileName.split(".").pop();

      setFileName(newFileName.length > 10 ? `${newFileName.slice(0, 4)}...${extension}` : newFileName);
      setFileExtension(extension);

      const originalFileName = newFileName.name;

      // Extract the file extension
      const fileExtension = originalFileName.split('.').pop();
      // Create a new File object with the desired name and the original file's properties
      const newFile = new File([file], getFileName(fileName1) + "." + fileExtension, {
        type: file.type,
        lastModified: file.lastModified
      });

      // Add the new file to your files array
      setFiles([...files, newFile]);

      // Update icon and style based on file extension
      if (["jpg", "jpeg", "png", "pdf", "xls", "xlsx"].includes(extension)) {
        setIconClass("fa fa-file-image-o");
        setLabelColor("#208440");
        setBorderColor("2px solid #208440");
      } else if (extension === "pdf") {
        setIconClass("fa fa-file-pdf-o");
        setLabelColor("red");
        setBorderColor("2px solid red");
      } else if (["doc", "docx"].includes(extension)) {
        setIconClass("fa fa-file-word-o");
        setLabelColor("#2388df");
        setBorderColor("2px solid #2388df");
      } else {
        setIconClass("fa fa-file-o");
        setLabelColor("black");
        setBorderColor("2px solid black");
      }
    } else {
      setFileName("Add File");
      setIconClass("fa fa-paperclip");
      setLabelColor("grey");
      setBorderColor("2px dashed grey");
    }
  };

  return (
    <label className="filelabel" style={{ border: borderColor }}>
      <i className={iconClass} style={{ color: labelColor }}></i>
      <span className="title" style={{ color: labelColor }}>
        {fileName || "Add File"}
      </span>
      <input
        multiple={false}
        type="file"
        id="FileInput"
        name="booking_attachment"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </label>
  );
};

export default FileUpload;
