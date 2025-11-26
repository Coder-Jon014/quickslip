"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Icon } from "@/components/ui/icon";
import { PricingTable } from "@/components/marketing/pricing-table";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function UpgradeModal({
    isOpen,
    onClose,
    title = "Unlock Pro Features",
    description = "You've hit a limit on the Free plan. Upgrade to Pro to continue growing your business."
}: UpgradeModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-6 text-left align-middle shadow-xl transition-all relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors"
                                >
                                    <Icon icon="solar:close-circle-bold" className="text-2xl" />
                                </button>

                                <div className="text-center mb-8 mt-4">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-zinc-400">
                                        {description}
                                    </p>
                                </div>

                                <PricingTable showTitle={false} />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
