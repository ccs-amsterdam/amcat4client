"use client";

import { useAmcatBranding } from "@/api/branding";
import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";
import { useMutateUser, useUsers } from "@/api/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { Loading } from "@/components/ui/loading";
import UserRoleTable from "@/components/Users/UserRoleTable";

import { useState } from "react";
import { Branding, BrandingFooter } from "@/components/Server/Branding";
import { AmcatBranding, AmcatConfig } from "@/interfaces";
import { ServerBrandingForm } from "./ServerBrandingForm";

const roles = ["READER", "WRITER", "ADMIN"];

enum Tab {
  Users = "users",
  Branding = "branding",
}

export default function Page() {
  const { user, signIn, loading: userLoading } = useMiddlecat();
  const { data: serverConfig, isLoading: configLoading } = useAmcatConfig();
  const { data: serverBranding, isLoading: brandingLoading } = useAmcatBranding();
  if (userLoading || configLoading || brandingLoading) return <Loading />;

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl px-6 py-6">
      <ServerSettings user={user} serverConfig={serverConfig!} serverBranding={serverBranding!} />
    </div>
  );
}

interface ServerSettingsProps {
  user: MiddlecatUser | undefined;
  serverConfig: AmcatConfig;
  serverBranding: AmcatBranding;
}

function ServerSettings({ serverConfig, serverBranding }: ServerSettingsProps) {
  const { user, loading } = useMiddlecat();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const { data: users, isLoading: loadingUsers } = useUsers(user);
  const mutate = useMutateUser(user);
  const [tab, setTab] = useState(Tab.Users);

  if (loadingUserDetails || loadingUsers) return <Loading />;

  const ownRole = serverConfig?.authorization === "no_auth" ? "ADMIN" : userDetails?.role;
  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutateAsync({ email, role, action }).catch(console.error);
  }

  let showTabs = Object.keys(Tab);
  if (!user || !ownRole || !users || !serverConfig || !changeRole) showTabs = showTabs.filter((key) => key === "Info");

  return (
    <div className="flex w-full flex-col gap-10">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="flex min-h-[500px] w-full flex-col">
        <TabsList className="mb-12 overflow-x-auto">
          {showTabs.map((tab) => {
            const tabValue = Tab[tab as keyof typeof Tab];
            return (
              <TabsTrigger key={tabValue} value={tabValue}>
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="w-full ">
          <TabsContent value={Tab.Users}>
            {user == null || ownRole == null || users == null ? (
              <span>You don't have permission to see this</span>
            ) : (
              <UserRoleTable user={user} ownRole={ownRole} users={users} changeRole={changeRole} roles={roles} />
            )}
          </TabsContent>
          <TabsContent value={Tab.Branding}>
            <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
              <ServerBrandingForm />
              <div className="flex flex-col items-center justify-start">
                <div className="py-3 font-bold">Branding preview</div>
                <div className="-mt-12 scale-75 overflow-hidden rounded-lg">
                  <Branding serverConfig={serverConfig!} serverBranding={serverBranding!} />
                  <BrandingFooter serverBranding={serverBranding!} />
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
