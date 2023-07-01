import { useState } from 'react';

const useNewsLetterAPI = () => {
  const [errorApi, setErrorApi] = useState<string>('');
  const [resultApi, setResultApi] = useState({});
  const [loading, setLoading] = useState<boolean>(false);

  const route = `${process.env.NEXT_PUBLIC_API_URL}/newsletter`;

  const handleRequest = async (url: string, options: RequestInit) => {
    setLoading(true);
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        setResultApi(data);
        setErrorApi('');
        setLoading(false);
        return data;
      } else {
        const errorData = await response.json();
        setErrorApi(errorData.error);
        setLoading(false);
        throw new Error(errorData.error);
      }
    } catch (error: any) {
      setErrorApi(error.message);
      setLoading(false);
      throw error;
    }
  };

  const createReqOptions = (method: string, data: any) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const searchSubscriber = (query: string) =>
    handleRequest(`${route}/search?query=${query}`, {
      method: 'GET',
    });

  const registered = () =>
    handleRequest(`${route}/registered`, {
      method: 'GET',
    });

  const filter = (url: string) =>
    handleRequest(`${route}/registered${url}`, {
      method: 'GET',
    });

  const deleteSubscribe = (id: string) =>
    handleRequest(`${route}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

  const subscribe = (email: string) =>
    handleRequest(`${route}/subscribe`, createReqOptions('POST', { email }));

  const toggleSubscribe = (id: string, active: boolean) =>
    handleRequest(
      `${route}/subscribe/toggle/${id}`,
      createReqOptions('PUT', { active })
    );

  const editSubscribe = (id: string, email: string) =>
    handleRequest(`${route}/edit/${id}`, createReqOptions('PUT', { email }));

  return {
    errorApi,
    resultApi,
    loading,
    setLoading,
    setErrorApi,
    registered,
    subscribe,
    deleteSubscribe,
    toggleSubscribe,
    editSubscribe,
    filter,
    searchSubscriber,
  };
};

export default useNewsLetterAPI;
