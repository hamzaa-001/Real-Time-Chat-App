import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required("Email is Required"),
  password: yup.string().min(6).required("Password is required"),
});
