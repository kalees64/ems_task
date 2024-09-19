import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";

const Register = () => {
  //Get data from the context API
  const {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    handleRegister,
    adminState,
    setAdminState,
    router,
  } = useContext(DataContext);
  return (
    <main className="w-full h-screen flex justify-center items-center  bg-cover ">
      <div className="w-96 mx-auto p-4 shadow-2xl shadow-black max-sm:w-72 rounded-lg bg-white/60 relative">
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

        <form
          onSubmit={(e) => {
            handleRegister(e);
          }}
        >
          {/* Name Input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-full"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full"
            />
          </div>

          {/* Phone Input */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="1234567890"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className="w-full"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {adminState ? "Add Employee" : "Register"}
          </Button>

          {!adminState && (
            <p className="pt-3">
              Already you have an account?
              <Link href="/" className="text-red-500">
                {" "}
                Login
              </Link>
            </p>
          )}
        </form>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
};

export default Register;
