import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
          >
            Essays
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/tags"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Search
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
