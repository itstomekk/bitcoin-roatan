import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageContainer>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-lg text-[hsl(210,40%,75%)] font-light mb-6">This page does not exist on the island.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-md bg-[hsl(25,95%,55%)] hover:bg-[hsl(25,95%,45%)] text-white font-semibold transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
