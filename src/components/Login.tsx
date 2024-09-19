import React, { useContext, useEffect, useState } from "react";
import DataContext from "../context/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "sonner";
import FormInput from "./form/formInput";
import TextAreaInput from "./form/textAreaInput";
import Form from "./form/form";

const Login = () => {
  //Get Data from the context API
  const { handleLogin, ulPhone, setulPhone, ulPass, setulPass } =
    useContext(DataContext);

  return (
    <div className="w-full h-screen flex items-center justify-center  bg-cover">
      <div className="w-96 mx-auto p-4 border max-sm:w-72 rounded shadow-2xl shadow-black bg-white/60">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form
          onSubmit={(e) => {
            handleLogin(e);
          }}
        >
          {/* Phone Input */}
          {/* <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="1234567890"
              value={ulPhone}
              onChange={(e) => {
                setulPhone(e.target.value);
              }}
              className="w-full"
            />
          </div> */}

          {/* Password Input */}
          {/* <div className="mb-6">
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
              value={ulPass}
              onChange={(e) => {
                setulPass(e.target.value);
              }}
              className="w-full"
            />
          </div> */}

          {/* Test Input */}
          <div className="mb-6">
            <FormInput
              name="Email"
              type="email"
              placeholder="abc@gmail.com"
              value={ulPhone}
              onChange={setulPhone}
            />
          </div>

          {/* Test Input */}
          <div className="mb-6">
            <FormInput
              name="Password"
              type="password"
              placeholder="••••••••"
              value={ulPass}
              onChange={setulPass}
            />
          </div>

          {/* Test Input */}
          {/* <div className="mb-6">
        <FormInput
          name="Testing"
          type="text"
          placeholder="••••••••"
          value={str}
          onChange={setStr}
          minLength={10}
        />
      </div> */}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
          <p className="pt-2">
            Already you have an account?
            <Link href="/register" className="text-red-500">
              {" "}
              Register
            </Link>
          </p>
        </form>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Login;
