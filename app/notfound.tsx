import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-9xl font-extrabold text-blue-600 tracking-tight">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600">
          We couldn't find the page you are looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}