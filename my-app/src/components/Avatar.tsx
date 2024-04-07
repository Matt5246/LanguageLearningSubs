"use client"
import React from 'react'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import SigninButton from './SigninButton'
import Link from 'next/link'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

function AvatarComponent() {
	const { setTheme, theme } = useTheme()
	return (
		<>
			<Dialog>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link href="/home/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
						<DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Theme
							<div className=''>
								{theme === 'dark' ? (
									<MoonIcon className="h-[1.2rem] w-[1.2rem] ml-2" />
								) : (
									<SunIcon className="h-[1.2rem] w-[1.2rem] ml-2" />
								)}
							</div>
						</DropdownMenuItem>
						<DialogTrigger asChild>
							<DropdownMenuItem>Settings</DropdownMenuItem>
						</DialogTrigger>
						<DropdownMenuSeparator />
						<DropdownMenuItem><SigninButton /></DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu >
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>
							<Settings />
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default AvatarComponent

function Settings() {
	return (
		<div className='select-none'>
			<Checkbox className='m-1' /><a> turn on periodical save</a><br></br>
			<Checkbox className='m-1' /><a> turn on pos tagging</a><br></br>
			<Checkbox className='m-1' /><a> turn on lemmatization</a><br></br>
		</div >
	)
}