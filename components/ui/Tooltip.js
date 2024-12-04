import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

// Base Tooltip that adapts to the device
const Tooltip = ({ children, ...props }) => {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <TooltipPrimitive.Root
      delayDuration={0}
      trigger={isTouchDevice ? "click" : "hover"}
      {...props}
    >
      {children}
    </TooltipPrimitive.Root>
  );
};

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        avoidCollisions
        collisionPadding={16}
        side="top" // Adjust this to bottom/left/right dynamically as needed
        align="center" // Aligns the tooltip with the trigger element
        flip // Flips to the other side if there's not enough space
        onPointerEnter={(e) => e.preventDefault()} // Prevent tooltip from opening during hover
        className={cn(
          "absolute z-[9999] rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-sm text-custom-dark-blue dark:text-custom-light-gray shadow-lg max-w-xs w-max",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
