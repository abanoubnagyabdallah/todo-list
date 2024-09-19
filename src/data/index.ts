import { ILoginInput, IRegisterInput } from "../interfaces";



export const REGISTER_FORM: IRegisterInput[] = [
    {
        type: "text",
        placeholder: "user name",
        name: "username",
        validation: { required: true, minLength: 5 }
        
    },
    {
        type: "email",
        placeholder: "email",
        name: "email",
        validation: { required: true, pattern: /^[^@]+@[^@]+\.[^@ .]{2,}$/ }
    },
    {
        type: "password",
        placeholder: "password",
        name: "password",
        validation: { required: true, minLength: 6 }
    },
]


export const LOGIN_FORM: ILoginInput[] = [
    {
      name: "identifier",
      placeholder: "Email address",
      type: "email",
      validation: {
        required: true,
        pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
      },
    },
    {
      name: "password",
      placeholder: "Password",
      type: "password",
      validation: {
        required: true,
        minLength: 6,
      },
    },
  ];
  