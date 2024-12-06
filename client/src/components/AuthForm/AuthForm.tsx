import { Box, Button, TextField } from "@mui/material"
import "./AuthForm.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { authApi } from "../../api/apis"
import { SignInUser, SignUpUser } from "../../types/types"
import Joi from 'joi'

type TAuthForm = {
    type: 'sign-up' | 'sign-in'
}

export const signUpSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must not exceed 30 characters",
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters long",
        }),
});

export const signInSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters long",
        }),
});


export default function AuthForm({ type }: TAuthForm) {
    const [user, setUser] = useState<SignInUser | SignUpUser | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);

    const navigate = useNavigate();
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        name: keyof (SignInUser & SignUpUser)
    ) => {
        setUser((prevState) => {
            const updatedUser = {
                ...(prevState || {}),
                [name]: e.target.value,
            };
            return updatedUser as SignInUser | SignUpUser;
        });
    };

    const validateFormWithErrors = (schema: Joi.ObjectSchema, data: any): boolean => {
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errorMap = error.details.reduce((acc: any, detail) => {
                acc[detail.path[0]] = detail.message;
                return acc;
            }, {});
            setErrors(errorMap);
            return false;
        }
        setErrors(null);
        return true;
    };

    const handleSignUp = async () => {
        if (!validateFormWithErrors(signUpSchema, user)) return;
        try {
            const response = await authApi.signUp(user as SignUpUser);
            if (response.data.success) {
                toast.success("User registered successfully")
                navigate('/sign-in')
                return;
            }
            toast.error(response.data.message);
            return;
        }
        catch (err: any) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    const handleSignIn = async () => {
        if (!validateFormWithErrors(signInSchema, user)) return;
        try {
            const response = await authApi.signIn(user as SignInUser);
            if (response.data.success) {
                toast.success("User logged in successfully")
                localStorage.setItem("authToken", response.data.data)
                navigate("/dashboard")
                return;
            }
            toast.error(response.data.message);
            return;
        }
        catch (err: any) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }


    const handleSubmit = async () => {
        try {
            if (type === "sign-in") {
                await handleSignIn();
            } else {
                await handleSignUp();
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="auth-form">
            <Box className="auth-box">
                <h1>{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>
                {type === "sign-up" && <TextField
                    type="text"
                    name="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleChange(e, "name")}
                    value={user && "name" in user ? user.name : ""}
                    error={!!errors?.name}
                    helperText={errors?.name}
                />}

                <TextField
                    type="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleChange(e, "email")}
                    value={user?.email || ""}
                    error={!!errors?.email}
                    helperText={errors?.email}
                />

                <TextField
                    type="password"
                    name="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleChange(e, "password")}
                    value={user?.password || ""}
                    error={!!errors?.password}
                    helperText={errors?.password}
                />

                <Button fullWidth variant="contained" onClick={() => { handleSubmit() }} className="auth-button">
                    {type === "sign-in" ? "Sign In" : "Sign Up"}
                </Button>
                <Box className="auth-link-box">
                    <span>
                        {type === "sign-up" ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <Link to={type === "sign-up" ? "/sign-in" : "/sign-up"}>
                        {type === "sign-up" ? "Sign In" : "Sign Up"}
                    </Link>
                </Box>
            </Box>
        </div>
    )
}