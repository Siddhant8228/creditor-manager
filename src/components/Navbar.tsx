interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({
  setCurrentPage,
}: NavbarProps) {
 const pages = [
  "Dashboard",
  "Ledger",
  "Outstanding Report",
  "Suppliers",
  "Bills",
  "Payments",
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