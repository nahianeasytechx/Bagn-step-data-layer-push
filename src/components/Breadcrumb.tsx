"use client"; // 🔹 Mark as Client Component

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ✅ usePathname for App Router (app/)

export default function Breadcrumb() {
  const pathname = usePathname(); 
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <nav aria-label="breadcrumb" className="text-gray-600 text-sm my-4">
      <ul className="flex items-center gap-2">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-500">{decodeURIComponent(segment)}</span>
              ) : (
                <Link href={href} className="text-blue-600 hover:underline">
                  {decodeURIComponent(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
