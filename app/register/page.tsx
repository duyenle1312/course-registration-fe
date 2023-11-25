"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

const FormSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  email: z
    .string()
    .email()
    .endsWith("@aubg.edu", { message: "Only @aubg.edu email allowed" }),
});

export default function Register() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      email: "",
    },
  });

  async function onSubmit(info: z.infer<typeof FormSchema>) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/register`, {
        method: "GET",
        headers: {
          username: `${info.first_name} ${info.last_name}`,
          email: info.email,
          password: info.password,
        },
      });
      const data = await res.json();
      // console.log(data);
      // console.log(res.status);
      if (res.status === 200) {
        form.reset()
        toast({
          title: data.message,
          description: "You can now log in.",
        });
      } else {
        toast({
          description: data.error
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-screen flex-col items-center justify-center p-32"
      >
        <Card>
          <CardHeader className="flex text-center space-y-1 px-3 my-2">
            <CardTitle className="text-2xl">Register New Account</CardTitle>
            <CardDescription>Course Management System</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid md:grid-cols-4 gap-x-3">
              <div className="grid col-span-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Tony" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid col-span-2">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Le" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="student@aubg.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
          <Link href="/login" className="relative flex justify-center text-xs">
            <span className="bg-background px-2 -mb-1 font-medium text-gray-500 hover:underline">
              Log In Here
            </span>
          </Link>
        </Card>
      </form>
    </Form>
  );
}
