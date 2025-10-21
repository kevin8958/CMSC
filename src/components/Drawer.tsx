"use client";

import Button from "@/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";

const Drawer = (props: Common.DrawerProps) => {
  const { open, title, children, showFooter, onConfirm, onCancel, onClose } =
    props;
  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => onClose()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="bg-primary-900 absolute right-0 flex h-full w-xl flex-col shadow-xl">
                  <div className="flex items-center justify-between p-4 text-white">
                    <Dialog.Title className="text-lg font-medium">
                      {title}
                    </Dialog.Title>
                    <Button variant="clear" onClick={() => onClose()}>
                      <IoClose className="text-xl" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">{children}</div>
                  {showFooter && (
                    <div className="flex justify-end gap-2 px-4 py-3">
                      <Button
                        classes="min-w-[80px]"
                        variant="outline"
                        onClick={onCancel ?? onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        classes="min-w-[80px]"
                        variant="contain"
                        onClick={onConfirm}
                      >
                        Confirm
                      </Button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Drawer;
