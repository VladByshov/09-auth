"use client"

import css from "./SignUp.module.css";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/lib/store/authStore";
import {useMutation} from "@tanstack/react-query";
import {getErrorMessage, register} from "@/lib/api/clientApi";

export default function SignUp(){
    const [error, setError] = useState("");
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: (user) => {
            setUser(user)
            router.push('/profile')
            router.refresh()
        },
        onError: (mutationError) => {
            setError(getErrorMessage(mutationError))
        },
    })

    const handleSubmit = async (formData: FormData) => {
        setError('')

        await registerMutation.mutateAsync({
            email: String(formData.get('email') ?? '').trim(),
            password: String(formData.get('password') ?? '').trim(),
        })
    }

    return (
        <main className={css.mainContent}>
            <h1 className={css.formTitle}>Sign up</h1>
            <form className={css.form} action={handleSubmit}>
                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className={css.input}
                        required
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className={css.input}
                        required
                    />
                </div>

                <div className={css.actions}>
                    <button type="submit" className={css.submitButton}>
                        Register
                    </button>
                </div>

                {error && <p className={css.error}>{error}</p>}
            </form>
        </main>
    );
}
