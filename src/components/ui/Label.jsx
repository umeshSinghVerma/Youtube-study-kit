import React from "react";
import { Root as LabelRoot } from "@radix-ui/react-label";
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelRoot
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
