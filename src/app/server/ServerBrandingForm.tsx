"use client";

import { useAmcatBranding, useMutateBranding } from "@/api/branding";
import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";
import { useMiddlecat } from "middlecat-react";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { amcatBrandingSchema, informationLinksSchema, linkArraySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RefinementCtx, z, ZodSchema } from "zod";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fromZodError } from "zod-validation-error";
import { JSONForm } from "@/components/ui/jsonForm";
import { AmcatBranding } from "@/interfaces";

export function ServerBrandingForm() {
  const { user, loading } = useMiddlecat();
  const { data: userDetails, isLoading: loadingUserDetails } = useCurrentUserDetails(user);
  const mutateBranding = useMutateBranding(user);
  const { data: branding, isLoading: loadingBranding } = useAmcatBranding();
  const { data: config } = useAmcatConfig();

  // function getJsonTransformer<S extends ZodSchema>(schema: S) {
  //   return (val: string, ctx: RefinementCtx): z.infer<typeof schema> | null => {
  //     if (!val) return null;
  //     try {
  //       return schema.parse(JSON.parse(val));
  //     } catch (error) {
  //       if (error instanceof ZodError) error = fromZodError(error);
  //       ctx.addIssue({ code: z.ZodIssueCode.custom, message: String(error) });
  //       return z.NEVER;
  //     }
  //   };
  // }

  // const formSchema = amcatBrandingSchema.extend({
  //   client_data: z.object({
  //     information_links: z.string().transform(getJsonTransformer(InformationLinksSchema)),
  //     welcome_buttons: z.string().transform(getJsonTransformer(LinkArraySchema)),
  //   }),
  // });

  const stringify = (input: any) => (input ? JSON.stringify(input) : "");
  const brandingForm = useForm<z.input<typeof amcatBrandingSchema>, unknown, z.output<typeof amcatBrandingSchema>>({
    resolver: zodResolver(amcatBrandingSchema),
    defaultValues: {
      ...branding,
      // client_data: {
      //   information_links: stringify(branding?.client_data?.information_links),
      //   welcome_buttons: stringify(branding?.client_data?.welcome_buttons),
      // },
    },
  });

  function brandingFormSubmit(values: z.output<typeof amcatBrandingSchema>) {
    mutateBranding.mutateAsync(values).catch(console.error);
  }

  if (loading || loadingBranding || loadingUserDetails) return <Loading />;
  const isAdmin = userDetails?.role === "ADMIN" || config?.authorization === "no_auth";
  const errors = brandingForm.formState.errors;
  return (
    <Form {...brandingForm}>
      <form onSubmit={brandingForm.handleSubmit(brandingFormSubmit)} className="space-y-6">
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
        <JSONForm
          control={brandingForm.control}
          name="client_data.welcome_buttons"
          label="Action Buttons below Welcome Text"
          schema={linkArraySchema}
        />
        <JSONForm
          control={brandingForm.control}
          name="client_data.information_links"
          label="Links column in homepage footer"
          schema={informationLinksSchema}
        />
        {!isAdmin ? null : <Button type="submit">Save changes</Button>}
      </form>
    </Form>
  );
}
