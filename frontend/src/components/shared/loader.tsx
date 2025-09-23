import { Leaf } from 'lucide-react';

export function Loader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative">
        <Leaf className="h-16 w-16 text-green-600 animate-bounce" />
        <div className="absolute inset-0 animate-spin">
          <div className="h-16 w-16 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}