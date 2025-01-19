import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { isEmail } from "../utilities/isEmail";
import { Link } from "react-router-dom";
import signupIllustration from "../assets/signupIllustration.svg"
import useStore from "../store/useStore";

export default function Signup() {
  interface formData {
    fname:string;
    lname:string;
    email: string;
    pwd: string;
  }
  const signup = useStore((state:any)=>state.signup)
  const [formData, setFormData] = useState<formData>({ fname:"",lname:"",email: "", pwd: "" });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    //Extra validation for formData
    if(formData.fname == ""){
        toast.error('First name can not be empty')   
    }
    else if (formData.lname == "") {
      toast.error("Last name can not be empty");
    }
    else if (formData.email == "") {
      toast.error("Email can not be empty");
    }
    else if (!isEmail(formData.email)) {
      toast.error("Please enter a valid email");
    }
    else if (formData.pwd === "") {
      toast.error("Password can not be empty");
    }
    else {
       await signup(formData)
    }
  };

  return (
    <div className="w-full min-h-screen  flex justify-center items-center  relative">
      <div className="absolute flex items-center  gap-[15px] right-0 top-0 translate-x-[-25px] translate-y-[25px]">
        <p>Already have an account?</p>
        <Link to={"/login"} className=" text-blue-500 cursor-pointer font-semibold">
          Login
        </Link>
      </div>

      <div className="h-full w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-500">
        <img src={signupIllustration} />
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-[80%] flex flex-col gap-[100px]">
          <div>
            <h1 className="text-[50px] font-bold">Become a member to BlogTask</h1>
            <p className="text-[20px]">Please signup using the form below.</p>
          </div>

          <form
            onSubmit={(e) => handleSubmit(e)}
            className="w-full flex flex-col gap-[25px]"
          >
            <div className="w-full flex flex-col gap-[15px]">
              <p className="text-[20px] font-bold">First name:</p>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, fname: e.target.value })
                }
                type="text"
                placeholder="John"
                className="w-full border-2 rounded-[15px] border-blue-500 outline-none px-[25px] h-[50px]"
              />
            </div>
            <div className="w-full flex flex-col gap-[15px]">
              <p className="text-[20px] font-bold">Last name:</p>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, lname: e.target.value })
                }
                type="text"
                placeholder="Doe"
                className="w-full border-2 rounded-[15px] border-blue-500 outline-none px-[25px] h-[50px]"
              />
            </div>
            <div className="w-full flex flex-col gap-[15px]">
              <p className="text-[20px] font-bold">Email:</p>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                placeholder="youremail@example.com"
                className="w-full border-2 rounded-[15px] border-blue-500 outline-none px-[25px] h-[50px]"
              />
            </div>
            <div className="w-full flex flex-col gap-[15px]">
              <p className="text-[20px] font-bold">Password:</p>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, pwd: e.target.value })
                }
                type="password"
                placeholder="Password"
                className="w-full border-2 rounded-[15px] border-blue-500 outline-none px-[25px] h-[50px]"
              />
            </div>
            <button
              type="submit"
              className="text-[20px] bg-blue-500 text-white px-[50px] py-[10px] rounded-full w-fit cursor-pointer"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
