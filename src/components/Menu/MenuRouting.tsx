"use client";

import { roleAtLeast } from "@/api/util";
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { AmcatUserRole, MenuRoute } from "@/interfaces";

export default function MenuRouting({
  routes,
  current,
  role,
  onSelect,
}: {
  routes: MenuRoute[];
  current: string;
  role: AmcatUserRole;
  onSelect: (value: string) => void;
}) {
  return (
    <DropdownMenuRadioGroup value={current} onValueChange={onSelect}>
      {routes.map((item) => {
        const allowed = !item.reqRole || roleAtLeast(role, item.reqRole);

        return (
          <DropdownMenuRadioItem key={item.pathname} disabled={!allowed} value={item.pathname} className="flex gap-2">
            {item.label}
          </DropdownMenuRadioItem>
        );
      })}
    </DropdownMenuRadioGroup>
  );
}
