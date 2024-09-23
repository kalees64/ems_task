import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import { Toaster } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

const Login = () => {
  //Get Data from the context API
  const { handleLogin, load, setLoad } = useContext(DataContext);

  //Form schema
  const loginSchema = z
    .object({
      email: z.string().email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters to 16 characters long")
        .max(16, "Password must be at least 8 characters to 16 characters long")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        ),
    })
    .required();

  // Use form declaration
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Submit function
  const formSubmit = (data: any) => {
    setLoad(true);
    handleLogin(data);
    form.reset();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center  bg-cover bg-white ">
      <div className="w-96 mx-auto p-4 border max-sm:w-72 rounded shadow-2xl shadow-black bg-white/60 dark:bg-white text-black">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Login
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)} method="post">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="abc@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-3 w-full">
              <Button type="submit" className="w-full" disabled={load}>
                {load && (
                  <span className="w-5 h-5 border-4 border-t-white border-gray-600 rounded-full animate-spin me-2"></span>
                )}
                Login
              </Button>
            </div>
            <div>
              <p className="pt-2">
                Already you have an account?
                <Link href="/register" className="text-red-500">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Login;
