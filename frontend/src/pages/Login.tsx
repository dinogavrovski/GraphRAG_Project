import {useState} from "react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import authBackground from "@/assets/auth-background.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen flex">
            {/* Left side - Image and Quote */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src={authBackground}
                    alt="Luxury car showroom"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/70"/>
                <div className="relative z-10 flex flex-col justify-center w-full h-full items-center text-center p-12 text-white">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
                        <blockquote className="text-lg italic leading-relaxed">
                            "Ambition is the path to success. Persistence is the vehicle you arrive in."
                        </blockquote>
                        <cite className="block mt-4 text-sm opacity-90">— Bill Bradley</cite>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-foreground">Sign in to your account</h1>
                        <p className="mt-2 text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-foreground">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                                />
                                <Label htmlFor="remember-me" className="ml-2 text-sm text-muted-foreground">
                                    Remember me
                                </Label>
                            </div>

                            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                                Forgot your password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full"/>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button type="button" variant="outline" className="w-full">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;