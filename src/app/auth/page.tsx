'use client'
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import axios from "axios"
import { signIn, useSession } from "next-auth/react"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { FcGoogle } from "react-icons/fc";
import { Icons } from "@/components/icons"
import { redirect } from "next/navigation"
export default function Authorization() {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: ""
	})
	const { status } = useSession();
	if (status === "authenticated") redirect("/home")

	const { toast } = useToast()
	const signupUser = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		axios.post('/api/signup', data).then(() => (
			toast({
				title: "User has been registered!",
				description: "Success.",
			}), window.location.href = "/home")).catch((e) => toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: `${e}`,
				action: <ToastAction altText="Ok!">Ok!</ToastAction>,
			}))

	};
	const signinUser = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			const result = await signIn('credentials', {
				...data,
				redirect: true,
			});
			if (result?.ok) {
				window.location.href = "/home";
				toast({
					title: "User has been logged in!",
					description: "Success.",
				});

			} else {
				toast({
					variant: 'destructive',
					title: "Something went wrong.",
					description: result?.error || "Unknown error occurred.",
					action: <ToastAction altText="Ok!">Ok!</ToastAction>,
				});
			}
		} catch (error) {
			console.error("Error:", error);
			toast({
				variant: 'destructive',
				title: "Something went wrong.",
				description: "An unexpected error occurred.",
				action: <ToastAction altText="Ok!">Ok!</ToastAction>,
			});
		}

	};
	return (
		<div className="flex justify-center items-center h-screen">
			<Tabs defaultValue="signin" className="w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signup">Sign Up</TabsTrigger>
					<TabsTrigger value="signin">Sign In</TabsTrigger>
				</TabsList>
				<TabsContent value="signup">
					<Card>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">Create an account</CardTitle>
							<CardDescription>
								Enter your email below to create your account
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div className="grid grid-cols-2 gap-6">
								<Button variant="outline" >
									<Icons.gitHub className="w-4 h-4 mr-2" />
									GitHub
								</Button>
								<Button variant="outline" >
									<Icons.google className="w-4 h-4 mr-2" />
									Google
								</Button>
							</div>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-card px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input id="name" placeholder="John Doe" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="m@example.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input id="password" type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
							</div>
						</CardContent>
						<CardFooter>
							<Button className="w-full">Create account</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="signin">
					<Card>
						<CardHeader>
							<CardTitle>Sign In</CardTitle>
							<CardDescription>
								Enter your credentials to sign in. Click sign in when you&apos;re ready.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="m@example.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label htmlFor="password">Password</Label>
								<Input id="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} type="password" />
							</div>
						</CardContent>
						<CardFooter className="flex flex-col space-y-2">
							<Button onClick={signinUser} className="w-full">Sign In</Button>
						</CardFooter>
						<CardFooter>

						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
