import { AmcatUserRole } from "@/interfaces";
import { amcatUserRoles } from "@/schemas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env?.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}

export function hasMinAmcatRole(role: AmcatUserRole | undefined, minRole?: AmcatUserRole) {
  if (!minRole) return true;
  if (!role) return false;
  const roleIndex = amcatUserRoles.indexOf(role);
  const minRoleIndex = amcatUserRoles.indexOf(minRole);
  return roleIndex >= minRoleIndex;
}
