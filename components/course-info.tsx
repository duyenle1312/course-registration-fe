"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  id: z.string().min(3, {
    message: "Course ID must be at least 3 characters.",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  teacher_id: z.string(),
  time: z.string().min(2, {
    message: "Time must be at least 2 characters.",
  }),
  credit: z.string(),
  notes: z.string().min(3, {
    message: "Notes must be at least 3 characters.",
  }),
});

interface Props {
  title: string;
  // role: string;
  functionality: string;
}

export function CourseInfo(props: Props) {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${API_url}/teachers`, {
      next: { revalidate: 1 }, // Revalidate every second
    })
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        setLoading(false);
        console.log(data);
      });
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      teacher_id: "",
      time: "",
      credit: "3",
      notes: "",
    },
  });

  async function onSubmit(info: z.infer<typeof FormSchema>) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      // Create a new course
      const res = await fetch(`${API_url}/courses`, {
        method: "POST",
        headers: {
          login_email: user.email,
          login_password: user.password,
          course_nr: info.id,
          name: info.title,
          description: `${info.description}. ${info.notes}.`,
          id: info.teacher_id.toString(),
          timeslots: info.time,
          cr_cost: info.credit.toString(),
        },
      });
      const data = await res.json();
      // console.log(data);
      // console.log(res.status);
      if (res.status === 200) {
        form.reset();
        toast({
          description: data.message,
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

  if (user?.role !== "admin" && loading === false) {
    return <div>Only Admin can view this page</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>
              Only Admin can make changes on this page
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="grid md:col-span-1 gap-2">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course ID</FormLabel>
                      <FormControl>
                        <Input placeholder="CLAS 1312" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:col-span-4 gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The Rise of The Roman Empire"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-x-5">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="teacher_id"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Instructor</FormLabel>
                      <FormControl className="w-full">
                        <Select onValueChange={field.onChange} defaultValue="0">
                          <SelectTrigger
                            id="teacher_id"
                            className="w-full line-clamp-1 truncate"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem
                                key={teacher?.id}
                                value={teacher?.id.toString()}
                              >
                                {teacher?.username} ({teacher?.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Course summary, expecting results, grading schemes, and course loads, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="General Education; Pre-requisites: ENG101, Junior Standing; WIC"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 space-x-5">
              <div className="grid col-span-2">
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="TTh 11:50-1:10pm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid col-span-2">
                <FormField
                  control={form.control}
                  name="credit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credits</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="3">
                          <SelectTrigger
                            id="credit"
                            className="line-clamp-1 w-full truncate"
                          >
                            <SelectValue placeholder="Select Credits" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button type="submit" className="px-6">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
