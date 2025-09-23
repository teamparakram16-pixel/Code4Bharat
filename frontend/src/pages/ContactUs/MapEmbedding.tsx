import React from "react";


const MapEmbed: React.FC = () => {
  return (
    <div style={{ width: "60%", height: "500px", borderRadius: "12px", overflow: "hidden" ,pointerEvents:"auto",zIndex:2,}}>
      <iframe
        title="Our College Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.6389668497504!2d74.92280267489119!3d12.866579587439182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba358ff28ef6cf3%3A0xe93953598f53c53c!2sSahyadri%20College%20Of%20Engineering%20%26%20Management%20(Autonomous)!5e0!3m2!1sen!2sin!4v1752159537830!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export {MapEmbed};