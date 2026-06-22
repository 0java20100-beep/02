import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Минимум 8 символов"),
});

export const orderSchema = z.object({
  name: z.string().min(2, "Введите имя").max(120),
  phone: z.string().min(5, "Введите телефон").max(40),
  telegram: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("Неверный email").optional().or(z.literal("")),
  projectType: z.string().min(1, "Выберите тип проекта").max(120),
  description: z.string().min(5, "Опишите задачу").max(5000),
  budget: z.string().max(120).optional().or(z.literal("")),
  deadline: z.string().max(120).optional().or(z.literal("")),
  files: z.array(z.string()).optional(),
});

export const projectCategoryEnum = z.enum([
  "LANDING_PAGE",
  "CORPORATE_WEBSITE",
  "ECOMMERCE",
  "WEB_APPLICATION",
  "DASHBOARD",
  "SAAS",
]);

export const projectStatusEnum = z.enum(["PUBLISHED", "DRAFT", "HIDDEN"]);

export const projectSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().max(100).optional(),
  description: z.string().min(1).max(2000),
  content: z.string().max(20000).optional().nullable(),
  category: projectCategoryEnum.default("LANDING_PAGE"),
  status: projectStatusEnum.default("PUBLISHED"),
  technologies: z.array(z.string()).default([]),
  coverImage: z.string().optional().nullable(),
  screenshots: z.array(z.string()).default([]),
  demoUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

export const reviewSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(160).optional().nullable(),
  avatar: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  text: z.string().min(2).max(2000),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const contactSchema = z.object({
  type: z.string().min(1).max(40),
  label: z.string().min(1).max(80),
  value: z.string().min(1).max(400),
  icon: z.string().max(40).optional().nullable(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const settingSchema = z.object({
  key: z.string().min(1).max(80),
  value: z.unknown(),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
