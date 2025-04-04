import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function Portal({ children }: { children: ReactNode }) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create a new div element for the portal
    const element = document.createElement('div');
    document.body.appendChild(element);
    setPortalElement(element);

    // Cleanup: Remove the portal element when the component unmounts
    return () => {
      document.body.removeChild(element);
    };
  }, []);

  if (!portalElement) {
    return null;
  }

  return createPortal(children, portalElement);
} 