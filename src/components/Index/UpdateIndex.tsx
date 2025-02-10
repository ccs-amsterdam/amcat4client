"use client";

import { useMutateIndex } from "@/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { AmcatIndex } from "@/interfaces";
import { amcatIndexUpdateSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMiddlecat } from "middlecat-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function UpdateIndex({ index, children }: { index: AmcatIndex; children?: React.ReactNode }) {
  const { user } = useMiddlecat();
  const { mutateAsync } = useMutateIndex(user);
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof amcatIndexUpdateSchema>>({
    resolver: zodResolver(amcatIndexUpdateSchema),
    defaultValues: { ...index, archived: undefined },
  });
  if (!index) return null;

  function onSubmit(values: z.input<typeof amcatIndexUpdateSchema>) {
    console.log(values);
    mutateAsync(amcatIndexUpdateSchema.parse(values)).then(() => setOpen(false));
  }
  console.log(form.formState.errors);
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild className="text-lg">
        {children}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Index</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="folder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to Image</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            <Button type="submit">Update Index Settings</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
