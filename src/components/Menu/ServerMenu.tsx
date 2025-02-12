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
import { z, ZodSchema } from "zod";
import { ZodError } from "zod-validation-error";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Refresh from "./Refresh";

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
          className="top-20 min-h-[50vh] w-[1500px] max-w-[95vw] translate-y-0 pt-12 lg:p-12"
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
        <div className="mx-auto w-full ">
          <TabsContent value={Tab.Info}>
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

  const formSchema = amcatBrandingSchema.extend({
    client_data: z.object({ information_links: z.string(), welcome_buttons: z.string() }),
  });

  const stringify = (input: any) => (input ? JSON.stringify(input) : "");
  const values: z.infer<typeof formSchema> = {
    ...branding,
    client_data: {
      information_links: stringify(branding?.client_data?.information_links),
      welcome_buttons: stringify(branding?.client_data?.welcome_buttons),
    },
  };

  const brandingForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
  });

  function brandingFormSubmit(values: z.input<typeof formSchema>) {
    // TODO can we validate/parse the json before going into the submit logic, i.e. in some validation step? or in the zod transform/refine?
    // (this would also fix the other todos as this function would be trivial)
    function format_zod_error(e: ZodError) {
      return e.issues.map((i) => `${i.path.pop()}: ${i.message}`).join("; ");
    }

    function extract_json_from_form<S extends ZodSchema>(
      field: keyof typeof values.client_data,
      schema: S,
    ): z.infer<S> {
      const input = values.client_data[field];
      if (!input) return null;
      let d;
      // TODO refactor with separate error handling for zod and json
      try {
        d = JSON.parse(input);
      } catch (error) {
        brandingForm.setError(`client_data.${field}`, { type: "validation", message: String(error) });
        return undefined;
      }
      const r = schema.safeParse(d);
      if (!r.success) {
        brandingForm.setError(`client_data.${field}`, { type: "validation", message: format_zod_error(r.error) });
        return undefined;
      }
      return r.data;
    }
    // TODO can we validate after constructing body and still get the validation at the right point
    const body: z.infer<typeof amcatBrandingSchema> = {
      ...values,
      client_data: {
        information_links: extract_json_from_form("information_links", InformationLinksSchema),
        welcome_buttons: extract_json_from_form("welcome_buttons", LinkArraySchema),
      },
    };
    if (Object.keys(brandingForm.formState.errors).length > 0) {
      console.error(brandingForm.formState.errors);
      return;
    }
    mutateBranding.mutateAsync(body).catch(console.error);
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
              <FormLabel>Welcome Text (Mardown)</FormLabel>
              <FormControl>
                <Textarea placeholder="# Title and text using **MarkDown**" {...field} value={field.value ?? ""} />
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
