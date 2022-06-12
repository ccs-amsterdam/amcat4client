import { Article } from "amcat4react";
import { useParams } from "react-router-dom";
import { useIndex } from "../../lib/navigation";

export default function ArticlePage() {
  const index = useIndex();
  const id = useParams().docid;

  if (index == null || id == null) return null;
  return <Article index={index} id={id} query={{}} />;
}
