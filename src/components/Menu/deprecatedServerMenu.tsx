"use client";

import { useAmcatBranding, useMutateBranding } from "@/api/branding";
import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";
import { useMutateUser, useUsers } from "@/api/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Loading } from "../ui/loading";
import UserRoleTable from "../Users/UserRoleTable";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { amcatBrandingSchema, InformationLinksSchema, LinkArraySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RefinementCtx, z, ZodSchema } from "zod";
import { ZodError } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Refresh from "./Refresh";
import { fromZodError } from "zod-validation-error";

const roles = ["READER", "WRITER", "ADMIN"];

export default function Index() {
  return (
    <div className="flex items-center ">
      {" "}
      <Dialog>
        <DialogTrigger>
          <Server className="h-8 w-8 text-primary hover:text-primary/70" />
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className=" top-[5rem] flex h-[calc(95vh-5rem)] w-[1200px] max-w-[95vw]  translate-y-0 flex-col  pt-12 lg:p-12"
        >
          <DialogTitle>
            <div className="flex items-center">
              <div className="flex-1">Server Settings</div>
              <div className="flex-1 justify-end text-right">
                <Refresh />
              </div>
            </div>
          </DialogTitle>

          <ServerSettings />
        </DialogContent>
      </Dialog>
    </div>
  );
}

enum Tab {
  Info = "info",
  Users = "users",
  Branding = "branding",
}

function ServerSettings() {
  const { user, loading } = useMiddlecat();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const { data: users, isLoading: loadingUsers } = useUsers(user);
  const mutate = useMutateUser(user);
  const [tab, setTab] = useState(Tab.Info);

  if (loading || loadingUserDetails || loadingUsers || loadingConfig) return <Loading />;

  const ownRole = config?.authorization === "no_auth" ? "ADMIN" : userDetails?.role;
  async function changeRole(email: string, role: string, action: "create" | "delete" | "update") {
    mutate.mutateAsync({ email, role, action }).catch(console.error);
  }

  let showTabs = Object.keys(Tab);
  if (!user || !ownRole || !users || !config || !changeRole) showTabs = showTabs.filter((key) => key === "Info");

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
          <TabsContent value={Tab.Info} className="">
            <h2 className="text-lg font-semibold">Server configuration</h2>
            <p className="text-sm">
              These settings are configured at the server level, and cannot be changed via the client
            </p>
            <div className="mt-4 grid grid-cols-[8rem,1fr]">
              <div className="font-bold">Resource</div>
              <div className="font-mono text-primary">{config?.resource}</div>

              <div className="font-bold">MiddleCat</div>
              <div className="font-mono text-primary">{config?.middlecat_url}</div>
              <div className="font-bold">Authorization</div>
              <div className="font-mono text-primary">{config?.authorization}</div>
            </div>
          </TabsContent>
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
