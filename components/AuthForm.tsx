"use client";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--border-radius-xl)',
      border: '1px solid var(--gray-200)',
      boxShadow: 'var(--shadow-xl)',
      minWidth: '400px',
      maxWidth: '500px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--primary-500), var(--purple-500))'
      }} />
      
      <div style={{ 
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Logo and Brand */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <Image 
            src="/logo.png" 
            alt="Cogniview Logo" 
            height={32} 
            width={38}
            style={{ width: 'auto', height: 'auto' }}
          />
          <h2 style={{
            background: 'linear-gradient(135deg, var(--primary-600), var(--purple-600))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: 0
          }}>
            Cogniview
          </h2>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--gray-900)',
            marginBottom: '0.5rem'
          }}>
            {isSignIn ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p style={{ 
            color: 'var(--gray-600)',
            fontSize: '1rem',
            margin: 0
          }}>
            {isSignIn 
              ? 'Sign in to continue your interview practice'
              : 'Create your account to start practicing with AI'
            }
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              width: '100%'
            }}
          >
            {!isSignIn && (
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>
            )}

            <div>
              <FormField
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder={isSignIn ? "Enter your password" : "Create a secure password"}
                type="password"
              />
            </div>

            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                color: 'white',
                padding: '0.875rem 1.5rem',
                borderRadius: 'var(--border-radius)',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-md)',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {isSignIn ? "🚀 Sign In" : "✨ Create Account"}
            </Button>
          </form>
        </Form>

        <div style={{ 
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <p style={{ 
            color: 'var(--gray-600)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              style={{
                color: 'var(--primary-600)',
                fontWeight: 600,
                textDecoration: 'none',
                marginLeft: '0.5rem',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-700)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--primary-600)';
              }}
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
