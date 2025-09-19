"use client";

import { useAmcatBranding, useMutateBranding } from "@/api/branding";
import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";
import { useMutateUser, useUsers } from "@/api/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loading } from "@/components/ui/loading";
import UserRoleTable from "@/components/Users/UserRoleTable";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { amcatBrandingSchema, InformationLinksSchema, LinkArraySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RefinementCtx, z, ZodSchema } from "zod";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fromZodError } from "zod-validation-error";
import { Branding } from "@/components/Server/Branding";
import { AmcatBranding, AmcatConfig } from "@/interfaces";
import { JSONForm } from "@/components/ui/jsonForm";

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
      <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
        <ServerSettings user={user} serverConfig={serverConfig!} serverBranding={serverBranding!} />
        <div className="flex flex-col items-center justify-start">
          <div className="py-3 font-bold">Branding preview</div>
          <div className="-mt-12 scale-75 overflow-hidden rounded-lg">
            <Branding serverConfig={serverConfig!} serverBranding={serverBranding!} />
          </div>
        </div>
      </div>
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
            <ServerBrandingForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ServerBrandingForm() {
  const { user, loading } = useMiddlecat();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const mutateBranding = useMutateBranding(user);
  const { data: branding, isLoading: loadingBranding } = useAmcatBranding();
  const { data: config } = useAmcatConfig();

  function getJsonTransformer<S extends ZodSchema>(schema: S) {
    return (val: string, ctx: RefinementCtx): z.infer<typeof schema> | null => {
      if (!val) return null;
      try {
        return schema.parse(JSON.parse(val));
      } catch (error) {
        if (error instanceof ZodError) error = fromZodError(error);
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: String(error) });
        return z.NEVER;
      }
    };
  }

  const formSchema = amcatBrandingSchema.extend({
    client_data: z.object({
      information_links: z.string().transform(getJsonTransformer(InformationLinksSchema)),
      welcome_buttons: z.string().transform(getJsonTransformer(LinkArraySchema)),
    }),
  });

  const stringify = (input: any) => (input ? JSON.stringify(input) : "");
  const brandingForm = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...branding,
      client_data: {
        information_links: stringify(branding?.client_data?.information_links),
        welcome_buttons: stringify(branding?.client_data?.welcome_buttons),
      },
    },
  });

  function brandingFormSubmit(values: z.output<typeof formSchema>) {
    console.log(values);
    mutateBranding.mutateAsync(values).catch(console.error);
  }

  if (loading || loadingBranding || loadingUserDetails) return <Loading />;
  const isAdmin = userDetails?.role === "ADMIN" || config?.authorization === "no_auth";
  const errors = brandingForm.formState.errors;
  return (
    <Form {...brandingForm}>
      <form onSubmit={brandingForm.handleSubmit(brandingFormSubmit)} className="space-y-2">
        <FormField
          control={brandingForm.control}
          name="server_name"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={brandingForm.control}
          name="server_url"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>External Project URL</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={brandingForm.control}
          name="server_icon"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Icon URL</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={brandingForm.control}
          name="welcome_text"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Text (Markdown)</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="# Title and text using **MarkDown**"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        {/*<JSONForm
          control={brandingForm.control}
          name="client_data.welcome_buttons"
          label="Action Buttons below Welcome Text"
          schema={z.object({ href: z.string(), label: z.string() })}
        />
        <JSONForm
          control={brandingForm.control}
          name="client_data.information_links"
          label="Additional Homepage Links"
          schema={z.object({ title: z.string(), links: z.array(z.object({ href: z.string(), label: z.string() })) })}
        />*/}
        <FormField
          control={brandingForm.control}
          name="client_data.welcome_buttons"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Buttons below Welcome Text </FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value} placeholder={LINKARRAY_PLACEHOLDER} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={brandingForm.control}
          name="client_data.information_links"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Homepage Links </FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value} placeholder={LINKS_PLACEHOLDER} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        {!isAdmin ? null : <Button type="submit">Save changes</Button>}
      </form>
    </Form>
  );
}

const LINKARRAY_PLACEHOLDER = '[{"href": "https://", "label": "label"}, ...]';
const LINKS_PLACEHOLDER = `[{"title": "Menu title", "links": ${LINKARRAY_PLACEHOLDER}}]`;
