import { useEffect } from 'react';
import { Input } from 'mdb-ui-kit';
import { useLocation } from 'react-router-dom';

const useMDBInputInit = () => {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs = document.querySelectorAll('[data-mdb-input-init]');
      inputs.forEach((input) => {
        if (!Input.getInstance(input)) {
          new Input(input);
        }
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};

export default useMDBInputInit;
