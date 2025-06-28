import React, { useState } from "react";
import EXIF from "exif-js";

export default function PhotoUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gpsData, setGpsData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
      extractGPS(file);
    } else {
      alert("Please select an image file");
    }
  };

  const extractGPS = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;
      EXIF.getData({ src: imgData }, function () {
        const lat = EXIF.getTag(this, "GPSLatitude");
        const latRef = EXIF.getTag(this, "GPSLatitudeRef");
        const lon = EXIF.getTag(this, "GPSLongitude");
        const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

        if (lat && lon && latRef && lonRef) {
          const latitude = convertDMSToDD(lat, latRef);
          const longitude = convertDMSToDD(lon, lonRef);
          setGpsData({ latitude, longitude });
        } else {
          setGpsData(null);
          alert("No GPS data found in the image.");
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const convertDMSToDD = (dms, ref) => {
    const [degrees, minutes, seconds] = dms;
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (ref === "S" || ref === "W") {
      dd = dd * -1;
    }
    return dd;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Photo Uploader</h1>

      <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
        Upload Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {selectedImage && (
        <div className="mt-6 flex flex-col items-center">
          <p className="mb-2 text-gray-700">Preview:</p>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-64 h-64 object-cover rounded-xl shadow-md mb-4"
          />
          {gpsData ? (
            <p className="text-green-700">
              GPS: {gpsData.latitude.toFixed(6)}, {gpsData.longitude.toFixed(6)}
            </p>
          ) : (
            <p className="text-red-600">No GPS data extracted.</p>
          )}
        </div>
      )}
    </div>
  );
}
