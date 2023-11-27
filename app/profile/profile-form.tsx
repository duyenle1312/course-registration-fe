"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useAuth from "@/lib/useAuth";
import { useEffect } from "react";

const accountFormSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().endsWith("@aubg.edu").min(2, {
    message: "Only emails from aubg.edu domain accepted",
  }),
  password: z.string(),
  phone: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function ProfileForm() {
  const { user, setUser } = useAuth();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: user,
  });

  useEffect(() => {
    if (user?.id !== 0) {
      // wait until user is loaded from local storage
      const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
      fetch(`${API_url}/account`, {
        method: "PATCH",
        headers: {
          login_email: user.email,
          login_password: user.password,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const current_user = { ...data, password: user.password };
          form.reset(current_user);
          // console.log(current_user);
        });
    }
  }, [user, form]);

  async function onSubmit(info: AccountFormValues) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const payload = {
      login_email: user.email,
      login_password: user.password,
      username: info?.username || "",
      email: info?.email || "",
      // password: info?.password || "", // some issue with the backend related to pw
      phone: info?.phone || "",
    };
    // console.log(payload)
    try {
      const res = await fetch(`${API_url}/account`, {
        method: "PATCH",
        headers: payload,
      });
      const data = await res.json();
      console.log(data);
      console.log(res.status);
      if (res.status === 200) {
        setUser({ ...data, password: info.password });
        toast({
          description: "Successfully update information",
        });
      } else {
        toast({
          description: data.error,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (user.id === 0) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  // defaultValue={user?.username}
                  placeholder="Your full name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  // defaultValue={user?.email}
                  placeholder="name@aubg.edu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  // defaultValue={user?.password}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  // defaultValue={user?.phone}
                  placeholder="+359898888888"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
