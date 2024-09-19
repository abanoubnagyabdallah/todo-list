import * as yup from "yup"

export const RegistrationSchema = yup.object({
    username: yup.string().required('username is required').min(5, "username should be at least 5 characters"),
    email: yup.string().required("email is required").matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/, "not valid email"),
    password: yup.string().required('password is required').min(6, "password should be at least 6 characters"),
}).required()

export const loginSchema = yup
    .object({
        identifier: yup
            .string()
            .required("Email is required.")
            .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a valid email address."),
        password: yup.string().required("Password is required.").min(6, "Password should be at least 6 characters."),
    })
    .required();
