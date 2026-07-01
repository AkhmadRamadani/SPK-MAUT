import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center">
                <p className="text-sm font-semibold text-primary mb-2">404</p>
                <h1 className="text-4xl font-bold text-foreground mb-4">Page not found</h1>
                <p className="text-base text-muted-foreground mb-8">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary-foreground rounded-lg bg-primary hover:bg-primary/90 transition-colors"
                >
                    Go back home
                </Link>
            </div>
        </main>
    );
}