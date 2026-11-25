import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, Copy, Mail, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import profile from "@/assets/profile-cutout.png";
import { type BudgetService, useBudgetChat } from "@/lib/budget-chat-context";

const WHATSAPP_NUMBER = "5585999022371";
const EMAIL_ADDRESS = "gabrielgurgel635@gmail.com";

type Step = "service" | "combine" | "scope" | "timeline" | "details" | "done";

type ChatMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const serviceLabels: Record<BudgetService, string> = {
  site: "Site / Landing Page",
  motion: "Motion Design",
  design: "Identidade Visual & Design",
  video: "Edição de Vídeo",
};

const serviceChoices: { id: BudgetService; label: string }[] = [
  { id: "site", label: "Site / Landing Page" },
  { id: "motion", label: "Motion Design" },
  { id: "design", label: "Identidade Visual & Design" },
  { id: "video", label: "Edição de Vídeo" },
];

const scopeOptionsByService: Record<BudgetService, readonly string[]> = {
  site: ["Landing page", "Site institucional", "Portfólio / Loja", "Interface / App web"],
  motion: [
    "Vinheta / Abertura de marca",
    "Motion para Reels / Ads",
    "Tipografia animada",
    "Outro formato",
  ],
  design: [
    "Identidade visual completa",
    "Social media / Carrosséis",
    "Campanha / Peças gráficas",
    "Outro",
  ],
  video: ["Reels / Shorts", "Vídeo institucional", "Depoimento / Entrevista", "Demanda recorrente"],
};

const timelineOptions = ["Urgente (até 15 dias)", "Este mês", "Ainda estou planejando"] as const;

function buildInitialMessages(): ChatMessage[] {
  return [
    {
      id: 1,
      sender: "bot",
      text: "Oi! Sou o assistente do Gabriel. Em menos de 1 minuto monto o resumo do seu projeto para você falar direto com ele no WhatsApp.",
    },
    {
      id: 2,
      sender: "bot",
      text: "O que você quer tirar do papel?",
    },
  ];
}

export function BudgetChatbot() {
  const { isOpen, launchRequest, closeChat, toggleChat } = useBudgetChat();
  const dialogId = useId();
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdRef = useRef(10);

  const [step, setStep] = useState<Step>("service");
  const [messages, setMessages] = useState<ChatMessage[]>(buildInitialMessages);
  const [selectedServices, setSelectedServices] = useState<BudgetService[]>([]);
  const [combineDraft, setCombineDraft] = useState<BudgetService[]>(["site", "motion"]);
  const [scope, setScope] = useState<string>("");
  const [referenceTitle, setReferenceTitle] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const nextMsgId = () => {
    msgIdRef.current += 1;
    return msgIdRef.current;
  };

  function resetConversation() {
    msgIdRef.current = 10;
    setMessages(buildInitialMessages());
    setStep("service");
    setSelectedServices([]);
    setCombineDraft(["site", "motion"]);
    setScope("");
    setReferenceTitle("");
    setTimeline("");
    setDetails("");
    setInputValue("");
    setCopied(false);
  }

  useEffect(() => {
    if (!launchRequest) return;
    const { service, projectTitle } = launchRequest;
    msgIdRef.current = 10;
    setCombineDraft(["site", "motion"]);
    setScope("");
    setTimeline("");
    setDetails("");
    setInputValue("");
    setCopied(false);
    setReferenceTitle(projectTitle ?? "");

    if (service) {
      const label = serviceLabels[service];
      const intro: ChatMessage[] = [
        {
          id: 1,
          sender: "bot",
          text: projectTitle
            ? `Vi que você curtiu "${projectTitle}"! Vamos montar seu orçamento de ${label}.`
            : `Perfeito! Vamos montar seu orçamento de ${label} em segundos.`,
        },
        {
          id: 2,
          sender: "user",
          text: label,
        },
        {
          id: 3,
          sender: "bot",
          text: "Qual formato descreve melhor o que você precisa?",
        },
      ];
      setSelectedServices([service]);
      setMessages(intro);
      setStep("scope");
      return;
    }

    resetConversation();
  }, [launchRequest]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeChat]);

  useEffect(() => {
    if (!isOpen) return;
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [isOpen, messages, step]);

  useEffect(() => {
    if (isOpen && (step === "details" || step === "done")) {
      inputRef.current?.focus();
    }
  }, [isOpen, step]);

  function handleSelectSingleService(service: BudgetService) {
    const label = serviceLabels[service];
    setSelectedServices([service]);
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), sender: "user", text: label },
      {
        id: nextMsgId(),
        sender: "bot",
        text: "Qual formato descreve melhor o que você precisa?",
      },
    ]);
    setStep("scope");
  }

  function handleStartCombine() {
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), sender: "user", text: "Combinar mais de 1 serviço" },
      {
        id: nextMsgId(),
        sender: "bot",
        text: "Legal! Marque as frentes que você quer combinar:",
      },
    ]);
    setStep("combine");
  }

  function toggleCombineService(service: BudgetService) {
    setCombineDraft((current) => {
      if (current.includes(service)) {
        return current.length > 1 ? current.filter((item) => item !== service) : current;
      }
      return [...current, service];
    });
  }

  function handleConfirmCombine() {
    const labels = serviceChoices
      .filter((choice) => combineDraft.includes(choice.id))
      .map((choice) => choice.label);
    setSelectedServices(combineDraft);
    setScope("");
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), sender: "user", text: labels.join(" + ") },
      {
        id: nextMsgId(),
        sender: "bot",
        text: "Qual é o prazo ideal para começar ou entregar?",
      },
    ]);
    setStep("timeline");
  }

  function handleSelectScope(chosenScope: string) {
    setScope(chosenScope);
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), sender: "user", text: chosenScope },
      {
        id: nextMsgId(),
        sender: "bot",
        text: "Qual é o prazo ideal para começar ou entregar?",
      },
    ]);
    setStep("timeline");
  }

  function handleSelectTimeline(chosenTimeline: string) {
    setTimeline(chosenTimeline);
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), sender: "user", text: chosenTimeline },
      {
        id: nextMsgId(),
        sender: "bot",
        text: "Quer deixar seu nome ou uma frase sobre o projeto? Se preferir, pode pular e ir direto pro WhatsApp.",
      },
    ]);
    setStep("details");
  }

  function finishWithDetails(text: string) {
    const cleaned = text.trim();
    if (cleaned) {
      setDetails((prev) => (prev ? `${prev} · ${cleaned}` : cleaned));
    }
    setMessages((prev) => [
      ...prev,
      {
        id: nextMsgId(),
        sender: "user",
        text: cleaned || "Pular e gerar resumo",
      },
      {
        id: nextMsgId(),
        sender: "bot",
        text: "Tudo pronto! Confira o resumo abaixo e envie direto no WhatsApp do Gabriel:",
      },
    ]);
    setInputValue("");
    setStep("done");
  }

  function handleComposerSubmit(event: FormEvent) {
    event.preventDefault();
    const cleaned = inputValue.trim();
    if (!cleaned) return;

    if (step === "details") {
      finishWithDetails(cleaned);
      return;
    }

    if (step === "done") {
      setDetails((prev) => (prev ? `${prev} · ${cleaned}` : cleaned));
      setMessages((prev) => [
        ...prev,
        { id: nextMsgId(), sender: "user", text: cleaned },
        {
          id: nextMsgId(),
          sender: "bot",
          text: "Adicionado ao resumo! Pode enviar quando quiser.",
        },
      ]);
      setInputValue("");
    }
  }

  const serviceSummaryLabel =
    selectedServices.length > 0
      ? serviceChoices
          .filter((choice) => selectedServices.includes(choice.id))
          .map((choice) => choice.label)
          .join(" + ")
      : "Projeto freelance";

  const summaryText = [
    `Olá Gabriel! Vim pelo seu portfólio e quero orçamento para ${serviceSummaryLabel}.`,
    ...(scope ? [`• Escopo: ${scope}`] : []),
    ...(referenceTitle ? [`• Referência: ${referenceTitle}`] : []),
    ...(timeline ? [`• Prazo ideal: ${timeline}`] : []),
    ...(details ? [`• Detalhes: ${details}`] : []),
  ].join("\n");

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summaryText)}`;
  const emailSubject = `Orçamento Freelance — ${serviceSummaryLabel}`;
  const emailHref = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryText)}`;

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const primaryService = selectedServices[0];
  const scopeOptions = primaryService ? scopeOptionsByService[primaryService] : [];
  const composerEnabled = step === "details" || step === "done";

  return (
    <>
      {isOpen && <div className="budget-chat-backdrop" aria-hidden="true" onClick={closeChat} />}

      {isOpen && (
        <section
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label="Assistente de orçamento freelance"
          className="budget-chat-window"
        >
          <header className="budget-chat-header">
            <div className="flex items-center gap-3 min-w-0">
              <span className="budget-chat-avatar">
                <img src={profile} alt="Gabriel Gurgel" width={40} height={40} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-(--signal-white) truncate">
                  Gab · Orçamento rápido
                </p>
                <p className="flex items-center gap-1.5 text-xs text-(--interface-gray)">
                  <span className="budget-chat-dot" aria-hidden="true" />
                  Disponível para projetos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                className="budget-chat-icon-btn"
                aria-label="Reiniciar conversa"
                title="Reiniciar conversa"
                onClick={resetConversation}
              >
                <RotateCcw size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="budget-chat-icon-btn"
                aria-label="Fechar chat de orçamento"
                onClick={closeChat}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div ref={messagesRef} className="budget-chat-messages" aria-live="polite">
            {messages.map((item) => (
              <div
                key={item.id}
                className={
                  item.sender === "bot"
                    ? "budget-chat-bubble budget-chat-bubble-bot"
                    : "budget-chat-bubble budget-chat-bubble-user"
                }
              >
                {item.text}
              </div>
            ))}

            {step === "service" && (
              <div className="budget-chat-options">
                {serviceChoices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className="budget-chat-chip"
                    onClick={() => handleSelectSingleService(choice.id)}
                  >
                    {choice.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="budget-chat-chip budget-chat-chip-outline"
                  onClick={handleStartCombine}
                >
                  Combinar mais de 1 serviço
                </button>
              </div>
            )}

            {step === "combine" && (
              <div className="budget-chat-options">
                {serviceChoices.map((choice) => {
                  const active = combineDraft.includes(choice.id);
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      className="budget-chat-chip"
                      aria-pressed={active}
                      onClick={() => toggleCombineService(choice.id)}
                    >
                      {choice.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="budget-chat-chip budget-chat-chip-confirm"
                  onClick={handleConfirmCombine}
                >
                  Confirmar serviços ({combineDraft.length})
                </button>
              </div>
            )}

            {step === "scope" && scopeOptions.length > 0 && (
              <div className="budget-chat-options">
                {scopeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="budget-chat-chip"
                    onClick={() => handleSelectScope(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step === "timeline" && (
              <div className="budget-chat-options">
                {timelineOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="budget-chat-chip"
                    onClick={() => handleSelectTimeline(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step === "details" && (
              <div className="budget-chat-options">
                <button
                  type="button"
                  className="budget-chat-chip budget-chat-chip-outline"
                  onClick={() => finishWithDetails("")}
                >
                  Pular e gerar resumo
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="budget-chat-summary">
                <p className="budget-chat-summary-label">Resumo pronto</p>
                <p className="budget-chat-summary-text">{summaryText}</p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d w-full justify-between mt-3"
                >
                  Enviar no WhatsApp
                  <span className="button-orb">
                    <MessageCircle size={17} aria-hidden="true" />
                  </span>
                </a>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-(--interface-gray)">
                  <a href={emailHref} className="budget-chat-secondary-action">
                    <Mail size={14} aria-hidden="true" />
                    Enviar por e-mail
                  </a>
                  <button
                    type="button"
                    className="budget-chat-secondary-action"
                    onClick={handleCopySummary}
                  >
                    {copied ? (
                      <>
                        <Check size={14} aria-hidden="true" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={14} aria-hidden="true" />
                        Copiar resumo
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="budget-chat-secondary-action"
                    onClick={resetConversation}
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    Novo orçamento
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleComposerSubmit} className="budget-chat-composer">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              disabled={!composerEnabled}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={
                step === "details"
                  ? "Seu nome ou resumo do projeto..."
                  : step === "done"
                    ? "Adicionar mais um detalhe ao resumo..."
                    : "Escolha uma opção acima..."
              }
              aria-label="Mensagem sobre seu projeto"
              className="budget-chat-input"
            />
            <button
              type="submit"
              disabled={!composerEnabled || !inputValue.trim()}
              aria-label="Enviar detalhes"
              className="budget-chat-send"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="btn-3d budget-chat-fab"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        aria-label={isOpen ? "Fechar chat de orçamento" : "Abrir chat de orçamento"}
        onClick={toggleChat}
      >
        <span className="budget-chat-dot" aria-hidden="true" />
        <span className="budget-chat-fab-label">{isOpen ? "Fechar" : "Orçamento"}</span>
        <span className="button-orb">
          {isOpen ? (
            <X size={18} aria-hidden="true" />
          ) : (
            <MessageCircle size={18} aria-hidden="true" />
          )}
        </span>
      </button>
    </>
  );
}
