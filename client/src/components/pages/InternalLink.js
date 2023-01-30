import React from "react";

const InternalLink = ({ href, children }) => (
  <a href={href} className="text-blue-500 hover:text-blue-800 font-medium">
    {children}
  </a>
);

export default InternalLink;
