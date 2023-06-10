import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signInWithGoogle } from '../../firebase/firebase_config'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase/firebase_config'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header(props) {
    const { user, auth, signInWithGoogle } = props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link
                        to="/"
                        className="-m-1.5 p-1.5">
                        <span className="sr-only">MAUT-APP</span>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg"
                            alt=""
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {
                        user ? (
                            <div className="flex items-center justify-between">
                                <Link
                                    to={'/profile'}
                                >
                                    <div className="flex items-center">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={user.photoURL ?? "https://wallpaperaccess.com/full/4595683.jpg"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://wallpaperaccess.com/full/4595683.jpg";
                                            }}
                                            alt=""
                                        />
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-900">{user.displayName}</div>
                                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => auth.signOut()}
                                    className="px-4 py-2 mx-4 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signInWithGoogle()}
                                className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                                <img
                                    className="w-6 h-6"
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    loading="lazy"
                                    alt="google logo"
                                />
                                <span>Login with Google</span>
                            </button>
                        )
                    }
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/"
                            className="-m-1.5 p-1.5">
                            <span className="sr-only">MAUT-APP</span>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg"
                                alt=""
                            />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">

                            <div className="py-6">
                                {
                                    user ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.photoURL ?? "https://www.svgrepo.com/show/475656/google-color.svg"}
                                                    alt=""
                                                />
                                                <div className="ml-3">
                                                    <div className="text-base font-medium text-gray-900">{user.displayName}</div>
                                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => auth.signOut()}
                                                className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => signInWithGoogle()}
                                            className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
                                            <img
                                                className="w-6 h-6"
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                loading="lazy"
                                                alt="google logo"
                                            />
                                            <span>Login with Google</span>
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}