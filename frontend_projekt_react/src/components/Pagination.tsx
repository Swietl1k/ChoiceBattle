import "./Pagination.css";

interface Props {
  cardsPerPage: number;
  totalCards: number;
  currentPage: number;
  paginate: (pageNumbers: number) => void;
}

function Pagination({
  cardsPerPage,
  totalCards,
  currentPage,
  paginate,
}: Props) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination  pagination-lg d-flex justify-content-center">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <a
              href="#!"
              onClick={() => paginate(number)}
              className="page-link text-light bg-dark"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
