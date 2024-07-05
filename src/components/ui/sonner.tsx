"use client";

import { Toaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof Toaster>;

const Sonner = ({ ...props }: ToasterProps) => {
  return <Toaster theme="light" className="toaster group" {...props} />;
};

export { Sonner };
