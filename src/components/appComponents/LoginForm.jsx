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
          // Handle Firebase errors
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
          // Handle other errors
          console.error("Unknown error", error);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="bg-slate-900 flex justify-center items-center">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-6">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="text-center text-3xl text-white font-bold">
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
                  className="block text-sm font-medium text-white/80"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className={`mt-1 w-full p-2 rounded-md border-gray-200 bg-slate-600/40 text-sm text-white shadow-sm ${
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
                  className="block text-sm font-medium text-white/80"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  className={`mt-1 w-full p-2 rounded-md border-gray-200 bg-slate-600/40 text-sm text-white shadow-sm ${
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
                <p className="text-sm text-white/80">
                  By creating an account, you agree to our &nbsp;
                  <a href="#" className="text-white/80 underline">
                    terms and conditions
                  </a>
                  &nbsp; and &nbsp;
                  <a href="#" className="text-white/80 underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-col col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p className="mt-4 text-sm text-white sm:mt-0">
                  Don&apos;t have an account? &nbsp;
                  <Link href="/register">Register</Link>.
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
