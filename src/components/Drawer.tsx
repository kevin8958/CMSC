import Button from "@/components/Button";
import FlexWrapper from "@/layout/FlexWrapper";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

const Drawer = (props: Common.DrawerProps) => {
  const {
    open,
    title,
    children,
    showFooter,
    confirmText,
    cancelText,
    deleteText,
    disableConfirm,
    onConfirm,
    onCancel,
    onDelete,
    onClose,
  } = props;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[90]" onClose={() => onClose()}>
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
              <Dialog.Panel className="bg-white absolute right-0 flex h-full w-xl flex-col shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 text-gray-900 border-b">
                  <Dialog.Title className="text-lg font-medium">
                    {title}
                  </Dialog.Title>
                  <Button variant="clear" onClick={() => onClose()}>
                    <IoClose className="text-xl text-gray-500" />
                  </Button>
                </div>

                <div className="relative flex-1 overflow-y-auto px-4 scroll-thin">
                  {children}
                </div>

                {/* Footer */}
                {showFooter && (
                  <FlexWrapper
                    justify={onCancel || onDelete ? "between" : "end"}
                    classes="w-full p-2 border-t"
                  >
                    {onCancel && !onDelete && (
                      <Button
                        classes="min-w-[80px] text-gray-900"
                        variant="clear"
                        onClick={onCancel ?? onClose}
                      >
                        {cancelText || "취소"}
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        classes="min-w-[80px] !text-danger !border-danger"
                        variant="outline"
                        onClick={onDelete}
                      >
                        {deleteText || "삭제"}
                      </Button>
                    )}
                    <Button
                      classes="min-w-[80px]"
                      color="green"
                      variant="contain"
                      disabled={disableConfirm}
                      onClick={onConfirm}
                    >
                      {confirmText || "등록"}
                    </Button>
                  </FlexWrapper>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Drawer;
