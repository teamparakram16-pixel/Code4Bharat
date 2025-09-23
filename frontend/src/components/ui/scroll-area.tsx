import { FC, ReactNode } from "react";

export const ScrollArea: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={`scroll-area ${className}`} style={{ overflowY: "auto" }}>
    {children}
  </div>
);