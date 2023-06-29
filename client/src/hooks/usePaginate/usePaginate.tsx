import { useState } from 'react';

const usePaginate = (data: any[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const items = data.slice(start, end);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return { items, nextPage, prevPage, currentPage, totalPages };
};

export default usePaginate;
