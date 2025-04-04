import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 100000);
  }, []);

  return <h1>You are all set! This window will close automatically in 5 seconds</h1>;
}
