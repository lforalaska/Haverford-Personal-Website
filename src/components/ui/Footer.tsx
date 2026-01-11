import { Container } from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-600">
            © {currentYear} All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Weekly essays on life and ideas
          </p>
        </div>
      </Container>
    </footer>
  );
}
