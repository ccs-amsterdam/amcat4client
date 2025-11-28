"use client";
import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ErrorMsg } from "@/components/ui/error-message";
import { HelpCircle, LogInIcon } from "lucide-react";
import { useAmcatSession } from "@/components/Auth/AuthProvider";
import { useMyIndexrole } from "@/api";
import { useParams } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ index: string }>();
  const { user, loading: loadingUser } = useAmcatSession();
  const indexRole = useMyIndexrole(user, params?.index);

  if (!indexRole) return <NoAccessToThisIndex />;

  return children;
}

function NoAccessToThisIndex({}: {}) {
  const { signIn } = useAmcatSession();

  return (
    <ErrorMsg type="No access">
      <p className="w-[500px] max-w-[95vw] text-center">You do not have access to this index</p>
    </ErrorMsg>
  );
}
