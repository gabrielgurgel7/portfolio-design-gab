import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type BudgetService = "site" | "motion" | "design" | "video";

export type OpenChatOptions = {
  service?: BudgetService | undefined;
  projectTitle?: string | undefined;
};

export type LaunchRequest = {
  id: number;
  service?: BudgetService | undefined;
  projectTitle?: string | undefined;
};

type BudgetChatContextValue = {
  isOpen: boolean;
  launchRequest: LaunchRequest | null;
  openChat: (options?: OpenChatOptions) => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const BudgetChatContext = createContext<BudgetChatContextValue | null>(null);

export function BudgetChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [launchRequest, setLaunchRequest] = useState<LaunchRequest | null>(null);

  const openChat = useCallback((options?: OpenChatOptions) => {
    setIsOpen(true);
    if (options?.service || options?.projectTitle) {
      setLaunchRequest((prev) => ({
        id: (prev?.id ?? 0) + 1,
        service: options.service,
        projectTitle: options.projectTitle,
      }));
    }
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((current) => !current), []);

  return (
    <BudgetChatContext.Provider value={{ isOpen, launchRequest, openChat, closeChat, toggleChat }}>
      {children}
    </BudgetChatContext.Provider>
  );
}

export function useBudgetChat() {
  const context = useContext(BudgetChatContext);
  if (!context) {
    throw new Error("useBudgetChat must be used within a BudgetChatProvider");
  }
  return context;
}
