import { useEffect, useState } from "react";
import Article, { ArticleProps } from "./Article";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Show a single article
 */
export default function ArticleModal({
  user,
  index,
  id,
  query,
  changeArticle,
  link,
}: ArticleProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [id]);
  if (!index || !id) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (changeArticle) changeArticle(null);
        setOpen(false);
      }}
    >
      <DialogContent className="w-screen max-w-6xl">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <Article user={user} id={id} index={index} query={query} link={link} />
      </DialogContent>
    </Dialog>
  );
}
