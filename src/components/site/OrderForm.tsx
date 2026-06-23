"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Paperclip, Send, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface OrderFormValues {
  name: string;
  phone: string;
  telegram: string;
  email: string;
  projectType: string;
  description: string;
  budget: string;
  deadline: string;
}

const PROJECT_TYPES = [
  "Лендинг",
  "Корпоративный сайт",
  "Интернет-магазин",
  "Web Application",
  "Dashboard",
  "SaaS / CRM / ERP",
  "UI/UX Дизайн",
  "SEO / Продвижение",
  "Другое",
];

export function OrderForm({ defaultType }: { defaultType?: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: { projectType: defaultType || PROJECT_TYPES[0] },
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  async function uploadFiles(): Promise<string[]> {
    if (files.length === 0) return [];
    const fd = new FormData();
    files.forEach((f) => fd.append("file", f));
    const res = await fetch("/api/orders/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Ошибка загрузки файлов");
    return json.data.urls as string[];
  }

  async function onSubmit(values: OrderFormValues) {
    setStatus("loading");
    setErrorMsg("");
    try {
      const fileUrls = await uploadFiles();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, files: fileUrls }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Не удалось отправить заявку");
      }
      setStatus("success");
      reset();
      setFiles([]);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Ошибка");
    }
  }

  const inputCls =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition";

  return (
    <section id="order" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading
          eyebrow="ЗАКАЗАТЬ"
          title="Расскажите о проекте"
          subtitle="Заполните форму — мы свяжемся с вами и пришлём предложение. Заявка приходит в Telegram и на email мгновенно."
        />

        {status === "success" ? (
          <div className="glass-strong rounded-2xl p-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary mb-4" />
            <h3 className="text-2xl font-semibold gradient-text">
              Заявка отправлена!
            </h3>
            <p className="mt-2 text-muted">
              Спасибо. Мы свяжемся с вами в ближайшее время.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-xl glass px-6 py-3 text-sm card-hover"
            >
              Отправить ещё одну
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="glass-strong rounded-2xl p-6 md:p-8 grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="text-xs text-muted">Имя *</label>
              <input
                className={inputCls}
                placeholder="Ваше имя"
                {...register("name", { required: "Введите имя" })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted">Телефон *</label>
              <input
                className={inputCls}
                placeholder="+998 ..."
                {...register("phone", { required: "Введите телефон" })}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted">Telegram</label>
              <input className={inputCls} placeholder="@username" {...register("telegram")} />
            </div>
            <div>
              <label className="text-xs text-muted">Email</label>
              <input className={inputCls} placeholder="you@mail.com" {...register("email")} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted">Тип проекта *</label>
              <select className={inputCls} {...register("projectType", { required: true })}>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-background">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted">Бюджет</label>
              <input className={inputCls} placeholder="$" {...register("budget")} />
            </div>
            <div>
              <label className="text-xs text-muted">Сроки</label>
              <input className={inputCls} placeholder="напр. 1 месяц" {...register("deadline")} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted">Описание задачи *</label>
              <textarea
                rows={4}
                className={inputCls}
                placeholder="Опишите ваш проект..."
                {...register("description", { required: "Опишите задачу" })}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl glass px-4 py-3 text-sm card-hover w-full sm:w-auto">
                <Paperclip className="h-4 w-4 text-primary" />
                Прикрепить файлы
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.zip"
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files || []).slice(0, 5))
                  }
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs"
                    >
                      {f.name}
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      >
                        <X className="h-3.5 w-3.5 text-muted hover:text-red-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {status === "error" && (
              <p className="sm:col-span-2 text-sm text-red-400">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Отправить заявку <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
