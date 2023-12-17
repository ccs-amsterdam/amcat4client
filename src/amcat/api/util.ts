import { AmcatQuery, AmcatFilters } from "@/amcat/interfaces";
import { useQuery } from "@tanstack/react-query";

export function addFilter(q: AmcatQuery, filters: AmcatFilters): AmcatQuery {
  const currentQueries = q.queries ?? [];
  const currentFilters = q.filters ?? {};
  return { queries: [...currentQueries], filters: { ...currentFilters, ...filters } };
}
