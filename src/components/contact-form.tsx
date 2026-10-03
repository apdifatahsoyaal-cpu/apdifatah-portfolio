"use client";

import { submitContactMessage, type ContactFormState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

const fields = [
  { id: "name", label: "Magaca", type: "text", icon: UserRound },
  { id: "email", label: "Iimayl", type: "email", icon: Mail },
  { id: "phone", label: "Telefoon", type: "tel", icon: Phone },
  { id: "subject", label: "Mawduuca", type: "text", icon: Send },
];

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    initialContactFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Xiriir
        </p>
        <h2
          id="contact-title"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Aan wada dhisno wax faa&apos;iido leh.
        </h2>
        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
          Mashruuc ama fikrad ma maskaxda ku haysaa? WhatsApp kala soo xiriir si
          aan si toos ah uga wada hadalno, ama fariin noogu soo dir foomka hoose.
        </p>
        <div className="mt-7 rounded-2xl border border-border bg-muted/35 p-5">
          <h3 className="font-semibold">WhatsApp ayaad doorbidaysaa?</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            WhatsApp fur si aan si toos ah uga wada hadalno mashruucaaga. Riix
            astaanta cagaaran ee shaashadda ku dheggan.
          </p>
        </div>
      </div>

      <form
        ref={formRef}
        action={formAction}
        aria-label="Foomka xiriirka"
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      >
        <div
          aria-hidden="true"
          className="absolute -left-[10000px] top-auto size-px overflow-hidden"
        >
          <label htmlFor="company_website">Meeshan madhan ka tag</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ id, label, type, icon: Icon }) => (
            <div key={id} className="space-y-2">
              <label
                htmlFor={id}
                className="text-sm font-medium text-foreground"
              >
                {label}
              </label>
              <div className="relative">
                <Icon
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id={id}
                  name={id}
                  type={type}
                  required={id === "name"}
                  maxLength={id === "name" ? 120 : id === "subject" ? 160 : undefined}
                  autoComplete={
                    id === "name"
                      ? "name"
                      : id === "email"
                        ? "email"
                        : id === "phone"
                          ? "tel"
                          : undefined
                  }
                  placeholder={label}
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
                />
              </div>
            </div>
          ))}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              Fariinta
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              placeholder="Wax yar iiga sheeg mashruucaaga..."
              className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </div>
        </div>
        {state.status !== "idle" ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`mt-4 rounded-lg px-3 py-2 text-sm ${
              state.status === "success"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Waa la dirayaa…" : "Dir fariinta"}
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
