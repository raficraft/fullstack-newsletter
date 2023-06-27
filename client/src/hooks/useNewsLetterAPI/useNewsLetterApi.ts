import { useState } from 'react';

const useNewsLetterAPI = () => {
  const [errorApi, setErrorApi] = useState<string>('');
  const [data, setData] = useState({});

  const route = `${process.env.NEXT_PUBLIC_API_URL}/newsletter`;

  const subscribe = async (email: string) => {
    try {
      const response = await fetch(`${route}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setData(data);
        setErrorApi('');
        console.log(data);
      } else {
        const errorData = await response.json();
        setErrorApi(errorData.error);
        console.log(errorData);
      }
    } catch (error: any) {
      console.error(error);
      setErrorApi(error.message);
    }
  };

  return {
    errorApi,
    subscribe,
  };
};

export default useNewsLetterAPI;
