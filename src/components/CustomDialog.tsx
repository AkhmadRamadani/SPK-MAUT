"use client";
import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export enum DialogType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR'
}

interface CustomDialogProps {
    open: boolean;
    title: string;
    content: string;
    type: DialogType;
    handler: () => void;
    okHandler: () => void;
}

export default function CustomDialog({ open, title, content, type, handler, okHandler }: CustomDialogProps) {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handler} initialFocus={cancelButtonRef}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg rounded-xl border border-border bg-card shadow-lg">
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {type === DialogType.INFO && (
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                                            </div>
                                        )}
                                        {type === DialogType.WARNING && (
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                                            </div>
                                        )}
                                        {type === DialogType.ERROR && (
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-destructive" aria-hidden="true" />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1">
                                            <Dialog.Title as="h3" className="text-lg font-semibold text-foreground">
                                                {title}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-muted-foreground">
                                                    {content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors"
                                        onClick={handler}
                                        ref={cancelButtonRef}
                                    >
                                        Batal
                                    </button>
                                    {type === DialogType.INFO && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                            onClick={okHandler}
                                        >
                                            OK
                                        </button>
                                    )}
                                    {type === DialogType.WARNING && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                                            onClick={okHandler}
                                        >
                                            OK
                                        </button>
                                    )}
                                    {type === DialogType.ERROR && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                            onClick={okHandler}
                                        >
                                            OK
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}