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
import { signIn } from "next-auth/react"

export default function Authorization() {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: ""
	})
	const signupUser = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		axios.post('/api/signup', data).then(() => alert('User has been registered!')).catch((e) => alert(e))
	};
	const signinUser = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		signIn('credentials', { ...data, redirect: false, }).then(() => alert('User has been logged in!')).catch((e) => alert(e))

	};
	return (
		<div className="flex justify-center items-center h-screen">
			<Tabs defaultValue="signup" className="w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signup">Sign Up</TabsTrigger>
					<TabsTrigger value="signin">Sign In</TabsTrigger>
				</TabsList>
				<TabsContent value="signup">
					<Card>
						<CardHeader>
							<CardTitle>Sign Up</CardTitle>
							<CardDescription>
								Enter your information to sign up. Click sign up when you're ready.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label htmlFor="name">Name</Label>
								<Input id="name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} defaultValue="" />
							</div>
							<div className="space-y-1">
								<Label htmlFor="email">Email</Label>
								<Input id="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} defaultValue="" />
							</div>
							<div className="space-y-1">
								<Label htmlFor="password">Password</Label>
								<Input id="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} type="password" />
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={signupUser}>Sign Up</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="signin">
					<Card>
						<CardHeader>
							<CardTitle>Sign In</CardTitle>
							<CardDescription>
								Enter your credentials to sign in. Click sign in when you're ready.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label htmlFor="email">Email</Label>
								<Input id="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} defaultValue="" />
							</div>
							<div className="space-y-1">
								<Label htmlFor="password">Password</Label>
								<Input id="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} type="password" />
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={signinUser}>Sign In</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
