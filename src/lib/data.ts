import { prisma } from "./prisma";

// Server-side data helpers used by React Server Components.
export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
    include: { uploadedSite: true },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, status: { not: "HIDDEN" } },
    include: { uploadedSite: true },
  });
}

export async function getUploadedSites() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED", uploadedSite: { isNot: null } },
    orderBy: { publishedAt: "desc" },
    include: { uploadedSite: true },
  });
}

export async function getPublishedReviews() {
  return prisma.review.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getVisibleContacts() {
  return prisma.contact.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export type PublicProject = Awaited<
  ReturnType<typeof getPublishedProjects>
>[number];
export type PublicReview = Awaited<
  ReturnType<typeof getPublishedReviews>
>[number];
export type PublicContact = Awaited<
  ReturnType<typeof getVisibleContacts>
>[number];
