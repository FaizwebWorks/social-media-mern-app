import { useEffect, useState } from "react";
import SnapifyLogo from "../assets/Snapify-removebg.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Hide from "../assets/svg/hide-password.svg";
import Show from "../assets/svg/show-password.svg";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const SignUp = () => {
  const { toast } = useToast();
  const { user } = useSelector(store => store.auth)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setIsLoading(true);
        const res = await axios.post(
          "http://localhost:3000/user/register",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          navigate("/login");
          toast({
            title: res.data.message,
            variant: "success",
          });
          setFormData({
            username: "",
            email: "",
            password: "",
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [])

  return (
    <div className="flex justify-center h-screen w-screen">
      <form
        className="flex flex-col gap-2 items-center p-12 lg:px-[40%] w-full rounded-lg"
        onSubmit={handleSubmit}
      >
        <img
          src={SnapifyLogo}
          alt="Snapify Logo"
          width={180}
          className="-mb-5"
        />
        <h1 className="text-2xl font-bold">Welcome to Snapify!</h1>
        <p className="text-xs text-zinc-500 text-center">
          Create an account to share moments and explore content from around the
          world.
        </p>
        <Label className="text-left w-full mt-3 text-base font-semibold">
          Username
        </Label>
        <Input
          className="w-full border-2 border-zinc-300 font-semibold rounded-md focus-visible:ring-transparent focus-within:border-black"
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && (
          <p className="text-red-500 w-full text-xs text-left">
            {errors.username}
          </p>
        )}
        <Label className="text-left w-full mt-3 text-base font-semibold">
          Email
        </Label>
        <Input
          className="w-full border-2 border-zinc-300 font-semibold rounded-md focus-visible:ring-transparent focus-within:border-black"
          type="email"
          placeholder="name@example.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 w-full text-xs text-left">
            {errors.email}
          </p>
        )}
        <Label className="text-left w-full mt-3 text-base font-semibold">
          Password
        </Label>
        <div className="relative w-full">
          <Input
            className="w-full border-2 border-zinc-300 font-semibold rounded-md focus-visible:ring-transparent focus-within:border-black"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <img
            src={showPassword ? Hide : Show}
            alt="Toggle Password Visibility"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 w-full text-xs text-left">
            {errors.password}
          </p>
        )}

        {isLoading ? (
          <Button className="mt-4 bg-blue-400 hover:bg-blue-400 text-white p-3 rounded-xl text-lg font-semibold w-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Creating Account..
          </Button>
        ) : (
          <Button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold w-full"
          >
            Create Account
          </Button>
        )}
        <p className="text-sm text-zinc-500 font-medium w-full text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold">
            Login
          </Link>
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-500 font-medium w-full text-center">
            By signing up, you agree to our
            <a href="#" className="text-black font-semibold">
              {" "}
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black font-semibold">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
