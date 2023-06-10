import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import DialogType from '../enum/DialogType'

class CustomDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            content: props.content,
            type: props.type,
        }
    }

    closeHandler = () => {
        this.props.handler()
    }

    okHandler = () => {
        this.props.okHandler()
    }

    render() {
        const { open } = this.props;
        return (
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={this.closeHandler}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            {
                                                (
                                                    () => {
                                                        if (this.state.type === DialogType.INFO) {
                                                            return (
                                                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                    <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                                                </div>
                                                            );
                                                        } else if (this.state.type === DialogType.WARNING) {
                                                            return (
                                                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                                                                </div>
                                                            );
                                                        } else if (this.state.type === DialogType.ERROR) {
                                                            return (
                                                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                )()
                                            }
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    {this.state.title}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {this.state.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        {
                                            (
                                                () => {
                                                    if (this.state.type === DialogType.INFO) {
                                                        return (

                                                            <button
                                                                type="button"
                                                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                                                onClick={this.okHandler}
                                                            >
                                                                OK
                                                            </button>
                                                        );
                                                    } else if (this.state.type === DialogType.WARNING) {
                                                        return (

                                                            <button
                                                                type="button"
                                                                className="inline-flex w-full justify-center rounded-md bg-yellow-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-400 sm:ml-3 sm:w-auto"
                                                                onClick={this.okHandler}
                                                            >
                                                                OK
                                                            </button>
                                                        );
                                                    } else if (this.state.type === DialogType.ERROR) {
                                                        return (

                                                            <button
                                                                type="button"
                                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                                onClick={this.okHandler}
                                                            >
                                                                OK
                                                            </button>
                                                        );
                                                    }
                                                }
                                            )()
                                        }
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={this.closeHandler}
                                        //   ref={this.cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        )
    }
}

export default CustomDialog
