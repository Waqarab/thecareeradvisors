import { useState } from 'react';

export function useConfirm() {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const [options, setOptions] = useState<{ title: string; message: string; confirmText?: string; cancelText?: string; isDestructive?: boolean } | null>(null);

  const confirmAction = (title: string, message: string, customOptions?: { confirmText?: string; cancelText?: string; isDestructive?: boolean }) => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
      setOptions({ title, message, ...customOptions });
    });
  };

  const handleClose = (value: boolean) => {
    setPromise(null);
    promise?.resolve(value);
  };

  const ConfirmationDialog = () => {
    if (!promise || !options) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="bg-white/90 backdrop-blur-2xl border border-white/20 w-full max-w-[320px] rounded-[18px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        >
          <div className="p-6 text-center space-y-2">
            <h3 className="text-[17px] font-semibold text-black tracking-tight">{options.title}</h3>
            <p className="text-[13px] text-gray-600 leading-tight">
              {options.message}
            </p>
          </div>
          <div className="flex flex-col border-t border-gray-200/50">
            <button
              onClick={() => handleClose(true)}
              className={`w-full py-3.5 text-[17px] ${options.isDestructive ? 'text-[#ff3b30]' : 'text-[#007aff]'} font-semibold border-b border-gray-200/50 active:bg-gray-100 transition-colors`}
            >
              {options.confirmText || 'Confirm'}
            </button>
            <button
              onClick={() => handleClose(false)}
              className="w-full py-3.5 text-[17px] text-[#007aff] font-normal active:bg-gray-100 transition-colors"
            >
              {options.cancelText || 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { ConfirmationDialog, confirmAction };
}
