"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { LoginSchema } from "@/schemas/LoginSchema";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredentials.user;

        if (user) {
          router.push("/");
        }

        router.push("/");
        formik.resetForm();
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/email-already-in-use":
              console.error("Email already in use");
              break;
            case "auth/invalid-email":
              console.error("Invalid email");
              break;
            case "auth/operation-not-allowed":
              console.error("Operation not allowed");
              break;
            case "auth/weak-password":
              console.error("Weak password");
              break;
            default:
              console.error("Unknown Firebase error", error);
          }
        } else {
          console.error("Unknown error", error);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="bg-[#FBFBFD] flex justify-center items-center">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-6">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="text-center text-3xl text-[#141414] font-bold">
              Flash Talk
            </h1>

            <form
              action="#"
              method="POST"
              onSubmit={formik.handleSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-[#323232]"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className={`mt-1 w-full p-2 rounded-lg border-2 border-[#4F5665] text-sm text-[#323232] shadow-sm ${
                    formik.errors.email ? "border-2 border-red-700" : ""
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <p className="text-rose-800 text-xs">{formik.errors.email}</p>
              </div>

              <div className="col-span-6 ">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-[#323232]"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  className={`mt-1 w-full p-2 rounded-lg border-2 border-[#4F5665] text-sm text-[#323232] shadow-sm ${
                    formik.errors.password ? "border-2 border-red-700" : ""
                  }`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <p className="text-rose-800 text-xs">
                  {formik.errors.password}
                </p>
              </div>

              <div className="col-span-6 ">
                <p className="text-sm text-[#323232]">
                  By creating an account, you agree to our &nbsp;
                  <a href="#" className="text-[#323232] underline">
                    terms and conditions
                  </a>
                  &nbsp; and &nbsp;
                  <a href="#" className="text-[#323232]underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-col col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-[#21978B] bg-[#21978B] px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-[#21978B] focus:outline-none focus:ring active:text-[#21978B]"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p className="mt-4 text-sm text-[#323232] sm:mt-0">
                  Don&apos;t have an account? &nbsp;
                  <Link href="/register" className="underline">
                    Register
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default RegisterForm;
