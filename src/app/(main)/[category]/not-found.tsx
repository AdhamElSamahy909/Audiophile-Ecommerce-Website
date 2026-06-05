import Link from "next/link";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <h2 className="text-4xl font-bold tracking-widest uppercase mb-6 text-black">
        Category Not Found
      </h2>
      <p className="text-black/50 mb-8 font-medium">
        Sorry, the category you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="bg-[#D87D4A] hover:bg-[#FBAF85] text-white uppercase text-[13px] font-bold tracking-[1px] px-8 py-4 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
