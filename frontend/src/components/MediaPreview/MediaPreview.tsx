import React from "react";
import { Typography, Button } from "@mui/material";
import {  InsertDriveFile } from "@mui/icons-material";
import { MediaPreviewProps } from "./MediaPreview.types";

const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  onMediaClick,
}) => {
  if (media.images && media.images.length > 0) {
    return (
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
        {media.images.length === 1 ? (
          <div
            className="relative cursor-pointer group"
            onClick={() => onMediaClick(0, media.images)}
          >
            <img
              src={media.images[0]}
              alt={"Media preview"}
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center"> */}
              {/* <Collections
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                fontSize="large"
              /> */}
            {/* </div> */}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {media.images.slice(0, 4).map((img: string, index) => (
              <div
                key={index}
                className={`relative ${index === 0 ? "row-span-2" : ""} ${
                  index === 3 && media.images.length > 4 ? "bg-black" : ""
                }`}
                onClick={() => onMediaClick(index, media.images)}
              >
                <img
                  src={img}
                  alt={`$media preview ${index}`}
                  className={`w-full h-full object-cover ${
                    index === 0 ? "h-full" : "h-40"
                  } transition-transform duration-300 hover:scale-105`}
                />
                {index === 3 && media.images.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold text-xl cursor-pointer">
                    +{media.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (media.video) {
    return (
      <div
        className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
      >
        <video
          src={media.video}
          controls
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <Typography variant="body2" className="text-white font-medium">
            Watch Video
          </Typography>
        </div>
      </div>
    );
  }
  if (media.document) {
    try {
      const url = new URL(media.document);
      const fileName = decodeURIComponent(
        url.pathname.split("/").pop() || "Document"
      );
      const fileExtension = fileName.split(".").pop()?.toUpperCase();

      return (
        <div
          className="mb-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
          onClick={() => window.open(media.document, "_blank")}
        >
          <div className="bg-gray-100 p-3 rounded-lg">
            <InsertDriveFile className="text-gray-600 text-3xl" />
          </div>
          <div className="flex-1">
            <Typography variant="subtitle1" className="font-medium">
              {fileName}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {fileExtension || "File"} Document
            </Typography>
          </div>
          <Button
            variant="outlined"
            size="small"
            className="border-green-600 text-green-600 hover:border-green-700 hover:text-green-700"
          >
            Download
          </Button>
        </div>
      );
    } catch (err) {
      return null; // fallback in case the Cloudinary URL is malformed
    }
  }

  return null;
};

export default MediaPreview;
