import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onDataProcessed }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a CSV file.');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      console.log(res.data);
      onDataProcessed(res.data);
    } catch (err) {
      console.error(err);
      alert('Error uploading file.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0
                   file:text-sm file:font-semibold
                   file:bg-gray-700 file:text-gray-100
                   hover:file:bg-gray-600 cursor-pointer"
      />
      <button type="submit" className="bg-red-100 px-4 py-2 rounded">
        Upload
      </button>
    </form>
  );
};

export default FileUpload;
