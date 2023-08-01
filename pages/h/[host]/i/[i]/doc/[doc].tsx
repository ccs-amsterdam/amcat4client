import { useRouter } from "next/router";
import { Article } from "../../../../../../amcat4react";
import { useMiddlecat } from "middlecat-react";

export default function DocPage() {
  const { user } = useMiddlecat();
  const router = useRouter();
  const index = router.query.i as string;
  const docid = router.query.doc as string;

  const changeArticle = (id: string | null) => {
    console.log("make link");
  };

  if (docid == null || index == null || !user) return null;
  return (
    <Article
      user={user}
      index={index}
      id={docid}
      query={{}}
      changeArticle={changeArticle}
    />
  );
}
