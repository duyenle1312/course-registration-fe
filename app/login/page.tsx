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
import { Label } from "@/components/ui/label";

export default function LogIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-32">
      <Card>
        <CardHeader className="flex text-center space-y-1">
          <CardTitle className="text-2xl px-6 py-3">
            Course Management System
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-gray-800">
              If you do not have an account, we will create one for you.
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Sign In</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
