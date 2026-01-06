import React, { createContext } from "react";

export const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  return (
    <FeedbackContext.Provider value={{}}>
      {children}
    </FeedbackContext.Provider>
  );
};
