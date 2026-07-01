"use client";
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid';

export function Header() {
    const { user, auth, signInWithGoogle } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">DSS-APP</span>
                        <div className="flex items-center gap-2">
                            <span className="text-foreground font-semibold text-lg hidden sm:block">DSS-APP</span>
                        </div>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-input text-muted-foreground hover:text-foreground hover:border-primary hover:bg-accent/30 transition-colors"
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="h-5 w-5" />
                        ) : (
                            <MoonIcon className="h-5 w-5" />
                        )}
                    </button>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {user ? (
                            <div className="flex items-center justify-between">
                                <Link href={'/profile'}>
                                    <div className="flex items-center hover:opacity-80 transition-opacity">
                                        <div className="relative h-10 w-10">
                                            <NextImage
                                                className="rounded-full border-2 border-primary"
                                                src={user.photoURL ?? "https://wallpaperaccess.com/full/4595683.jpg"}
                                                alt=""
                                                fill
                                                sizes="40px"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-foreground">{user.displayName}</div>
                                            <div className="text-xs font-medium text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => auth.signOut()}
                                    className="px-4 py-2 mx-4 border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary hover:bg-accent/30 transition-colors text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signInWithGoogle()}
                                className="px-4 py-2 border border-input rounded-lg text-foreground hover:border-primary hover:bg-accent/30 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="w-5 h-5"
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    loading="lazy"
                                    alt="google logo"
                                />
                                <span>Login with Google</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">DSS-APP</span>
                            <div className="flex items-center gap-2">
                                <span className="text-foreground font-semibold text-lg">DSS-APP</span>
                            </div>
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border border-input text-muted-foreground hover:text-foreground hover:border-primary hover:bg-accent/30 transition-colors"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-border">
                            <div className="py-6">
                                <div className="flex items-center gap-2 mb-4">
                                    {user ? (
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                <div className="relative h-10 w-10">
                                                    <NextImage
                                                        className="rounded-full border-2 border-primary"
                                                        src={user.photoURL ?? "https://www.svgrepo.com/show/475656/google-color.svg"}
                                                        alt=""
                                                        fill
                                                        sizes="40px"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-foreground">{user.displayName}</div>
                                                    <div className="text-xs font-medium text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => auth.signOut()}
                                                className="px-4 py-2 border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary hover:bg-accent/30 transition-colors text-sm font-medium"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => signInWithGoogle()}
                                            className="px-4 py-2 border border-input rounded-lg text-foreground hover:border-primary hover:bg-accent/30 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                className="w-5 h-5"
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                loading="lazy"
                                                alt="google logo"
                                            />
                                            <span>Login with Google</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}