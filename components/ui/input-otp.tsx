"use client";

import * as React from "react";
import { Minus } from "lucide-react";

import { cn } from "./utils";

interface InputOTPProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

const InputOTPContext = React.createContext<{
  slots: Array<{ char: string; hasFakeCaret: boolean; isActive: boolean }>;
}>({ slots: [] });

function InputOTP({
  value = "",
  onChange,
  length = 6,
  disabled = false,
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  
  const slots = React.useMemo(() => {
    return Array.from({ length }, (_, index) => ({
      char: value[index] || "",
      hasFakeCaret: index === focusedIndex && index === value.length,
      isActive: index === focusedIndex,
    }));
  }, [value, focusedIndex, length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    const { key } = e;
    
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      const newValue = value.slice(0, focusedIndex) + key + value.slice(focusedIndex + 1);
      onChange?.(newValue.slice(0, length));
      setFocusedIndex(Math.min(focusedIndex + 1, length - 1));
    } else if (key === 'Backspace') {
      e.preventDefault();
      if (value[focusedIndex]) {
        const newValue = value.slice(0, focusedIndex) + value.slice(focusedIndex + 1);
        onChange?.(newValue);
      } else if (focusedIndex > 0) {
        setFocusedIndex(focusedIndex - 1);
        const newValue = value.slice(0, focusedIndex - 1) + value.slice(focusedIndex);
        onChange?.(newValue);
      }
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      setFocusedIndex(Math.max(0, focusedIndex - 1));
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      setFocusedIndex(Math.min(length - 1, focusedIndex + 1));
    }
  };

  return (
    <InputOTPContext.Provider value={{ slots }}>
      <div
        data-slot="input-otp"
        className={cn(
          "flex items-center gap-2",
          disabled && "opacity-50",
          containerClassName,
        )}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {Array.from({ length }, (_, index) => (
          <div
            key={index}
            onClick={() => !disabled && setFocusedIndex(index)}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center border border-input text-sm transition-all",
              "first:rounded-l-md last:rounded-r-md",
              focusedIndex === index && "border-ring ring-2 ring-ring/50 z-10",
              className,
            )}
          >
            {value[index] || ""}
            {index === focusedIndex && index === value.length && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-px bg-foreground animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </InputOTPContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

interface InputOTPSlotProps extends React.ComponentProps<"div"> {
  index: number;
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const context = React.useContext(InputOTPContext);
  const slot = context?.slots[index] || { char: "", hasFakeCaret: false, isActive: false };

  return (
    <div
      data-slot="input-otp-slot"
      data-active={slot.isActive}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border border-input text-sm transition-all",
        "first:rounded-l-md last:rounded-r-md",
        slot.isActive && "border-ring ring-2 ring-ring/50 z-10",
        className,
      )}
      {...props}
    >
      {slot.char}
      {slot.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px bg-foreground animate-pulse" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <Minus className="h-4 w-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
