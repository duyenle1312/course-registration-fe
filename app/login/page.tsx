"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

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
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z
    .string()
    .email()
    .endsWith("@aubg.edu", { message: "Only @aubg.edu email allowed" }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function LogIn() {
  const router = useRouter()
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(info: z.infer<typeof FormSchema>) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/login`, {
        method: "POST",
        headers: {
          login_email: info.email,
          login_password: info.password,
        },
      });
      const data = await res.json();
      // console.log(data);
      // console.log(res.status);
      if (res.status === 200) {
        const loggedInUser = {...data, password: info.password}
        localStorage.setItem("current_user", JSON.stringify(loggedInUser));
        form.reset();
        toast({
          description: "Log In Successfully",
        });
        router.replace('/')
      } else {
        toast({
          description: data.error,
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
          <CardHeader className="flex text-center space-y-1">
            <CardTitle className="text-2xl px-5 py-3">
              Course Management System
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
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
            <Button className="w-full">Sign In</Button>
          </CardFooter>
          <Link
            href="/register"
            className="relative flex justify-center text-xs"
          >
            <span className="bg-background px-2 -mb-1 font-medium text-gray-500 hover:underline">
              Register Here
            </span>
          </Link>
        </Card>
      </form>
    </Form>
  );
}
