import { useState, useEffect } from "react";

const Toast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  // This component is not being used directly as we're using shadcn's toast
  // It's included here for reference to match the design, but we're using the
  // useToast hook from @/hooks/use-toast instead

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg transition-opacity duration-300 z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
