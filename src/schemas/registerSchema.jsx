import * as yup from "yup";

export const registerSchema = yup.object().shape({
  full_name: yup.string().min(2).max(25).required("Name is required"),
  email: yup.string().email().required("Email is Required"),
  password: yup.string().min(6).required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")])
    .required("Please confirm your password"),
});
