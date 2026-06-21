interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({
  setCurrentPage,
}: NavbarProps) {
 const pages = [
  "Dashboard",
  "Suppliers",
  "Bills",
  "Payments",
  "Returns",
  "Ledger",
  "Outstanding Report",
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}