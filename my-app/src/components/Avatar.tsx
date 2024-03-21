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
import { redirect } from "next/navigation";

function AvatarComponent() {
	const { setTheme, theme } = useTheme()
	return (
		<>
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
					<DropdownMenuItem onClick={() => redirect("/home/profile")}><Link href="/home/profile">Profile</Link></DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Theme
						<div className=''>
							{theme === 'dark' ? (
								<MoonIcon className="h-[1.2rem] w-[1.2rem] ml-2" />
							) : (
								<SunIcon className="h-[1.2rem] w-[1.2rem] ml-2" />
							)}
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem><SigninButton /></DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu >
		</>
	)
}

export default AvatarComponent
