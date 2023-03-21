import React, { useState } from "react";

function usePagination(data, itemsPerPage) {
  let [page, setPage] = useState(1);  
  
  const [currentPage, setCurrentPage] = useState(1);

  const count = Math.ceil(data.length / itemsPerPage);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage(currentPage => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  }

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(currentPage => Math.min(pageNumber, maxPage));
  }


  const handleChangePage = (e, p) => {
    setPage(p);
    jump(p);
  };

  return { count, page, setPage, next, prev, jump, currentData, currentPage, maxPage, handleChangePage };
}

export default usePagination;
