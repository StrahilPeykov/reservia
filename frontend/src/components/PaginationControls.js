import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page items
  const pageItems = [];
  
  // Always show first page
  pageItems.push(
    <Pagination.Item 
      key={0} 
      active={currentPage === 0}
      onClick={() => onPageChange(0)}
    >
      1
    </Pagination.Item>
  );
  
  // Show ellipsis if needed
  if (currentPage > 2) {
    pageItems.push(<Pagination.Ellipsis key="ellipsis-1" disabled />);
  }
  
  // Show current page and neighbors
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 2); i++) {
    pageItems.push(
      <Pagination.Item 
        key={i} 
        active={currentPage === i}
        onClick={() => onPageChange(i)}
      >
        {i + 1}
      </Pagination.Item>
    );
  }
  
  // Show ellipsis if needed
  if (currentPage < totalPages - 3) {
    pageItems.push(<Pagination.Ellipsis key="ellipsis-2" disabled />);
  }
  
  // Always show last page if there is more than one page
  if (totalPages > 1) {
    pageItems.push(
      <Pagination.Item 
        key={totalPages - 1} 
        active={currentPage === totalPages - 1}
        onClick={() => onPageChange(totalPages - 1)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }
  
  return (
    <Pagination className="justify-content-center my-4">
      <Pagination.Prev 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      />
      {pageItems}
      <Pagination.Next 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      />
    </Pagination>
  );
};

export default PaginationControls;