import Link from "next/link";
import { Header } from "@/components/Header";

export default function Login() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                        Login ke SPK-DSS
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Gunakan akun Google untuk masuk ke aplikasi.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-muted-foreground text-center">
                            Fitur login menggunakan autentikasi Google tersedia melalui header aplikasi. Silakan gunakan tombol &ldquo;Login with Google&rdquo; di bagian atas halaman.
                        </p>
                    </div>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Kembali ke{' '}
                        <Link href="/" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Beranda
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}