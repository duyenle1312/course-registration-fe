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
import useAuth from "@/lib/useAuth";

const FormSchema = z.object({
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
});

export default function CreateDepartment() {
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      department: "",
    },
  });

  async function onSubmit(info: z.infer<typeof FormSchema>) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/departments`, {
        method: "POST",
        headers: {
          login_email: user?.email,
          login_password: user?.password,
          name: info.department,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        form.reset();
        toast({
          description: data.message,
        });
        router.replace("/departments");
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
        className="flex lg:w-2/6 md:w-1/2 w-full px-5 min-h-screen flex-col items-center justify-center"
      >
        <Card className="w-full">
          <CardHeader className="flex text-center space-y-1">
            <CardTitle className="text-2xl px-5 py-3">
              Create New Department
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
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
        </Card>
      </form>
    </Form>
  );
}
