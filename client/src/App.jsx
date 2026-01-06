import React from "react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import InsightsPanel from "./components/InsightsPanel";

export default function App() {
  return (
    <div>
      <FeedbackForm />
      <FeedbackList />
      <InsightsPanel />
    </div>
  );
}
