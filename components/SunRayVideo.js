"use client";

import React from "react";

const SunRayVideo = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/assets/vids/sunrays2.webm" type="video/webm" />
        {/* You can add fallback content here if the video is not supported */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default SunRayVideo;
