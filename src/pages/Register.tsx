import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form"
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup"
import { RegistrationSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  username: string
  email: string
  password: string
}


const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate=useNavigate()
  // ================================ start handel ===============================
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({ resolver: yupResolver(RegistrationSchema) })
  const onSubmit: SubmitHandler<IFormInput> = async data => {
    console.log(data)
    setIsLoading(true)
    try {
      const res = await axiosInstance.post("/auth/local/register", data, {
        headers: {
          'Content-Type': 'application/json',
          'x-custom-header': 'my-custom-header',
        }
      })
      console.log(res);
      if (res.status === 200) {
        toast.success("You will navigate to the login page after 2 seconds to login!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });

        setTimeout(() => {
          navigate('/Login')
        }, 2000);

      }
      setIsLoading(false)
    } catch (error) {
      const errorObject = error as AxiosError<IErrorResponse>
      toast.error(`${errorObject.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
      setIsLoading(false)
    }
  }
  // ================================ end handel ===============================


  // ================================ start render ===============================
  const renderFormRegister = REGISTER_FORM.map((input, index) => {
    return (
      <div key={index}>
        <Input type={input.type} placeholder={input.placeholder} {...register(input.name, input.validation)} />
        {errors[input.name] && <InputErrorMessage msg={errors[input.name]?.message} />}
      </div>
    )
  })
  // ================================ end render ===============================

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderFormRegister}
        <Button fullWidth>{isLoading ? <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg> : "Register"}</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
