import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";
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

const Register = () => {
  //Get data from the context API
  const { adminState, setAdminState, router, handleRegister, load, setLoad } =
    useContext(DataContext);

  //Form Schema
  const registerSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name should be greater than 2 letters" }),
    email: z.string().email("Please enter the valid email address"),
    phone: z
      .string()
      .min(10, { message: "Phone number should be 10 digits" })
      .max(10, { message: "Phone number should be 10 digits" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters to 16 characters long")
      .max(16, "Password must be at least 8 characters to 16 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      ),
  });

  //Use form Declaration
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  //form submit fuction
  const formSubmit = (data: any) => {
    // console.log(data);
    setLoad(true);
    handleRegister(data);
    form.reset();
  };

  return (
    <main className="w-full h-screen flex justify-center items-center  bg-cover bg-white">
      <div className="w-96 mx-auto p-4 shadow-2xl shadow-black max-sm:w-72 rounded-lg bg-white/60 relative text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {adminState ? "Add Employee" : "Register"}
        </h2>

        {adminState && (
          <Icon
            icon="iconamoon:arrow-left-5-circle-bold"
            fontSize={30}
            className="absolute top-4 left-5"
            onClick={() => {
              setAdminState(!adminState);
              router.push("/admin/employees");
            }}
          />
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Robert" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="robert@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      required={false}
                      placeholder="9656458767"
                    />
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
                {adminState ? "Add Employee" : "Register"}
              </Button>
            </div>
            <div>
              {!adminState && (
                <p className="pt-3">
                  Already you have an account?
                  <Link href="/" className="text-red-500">
                    {" "}
                    Login
                  </Link>
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
};

export default Register;
