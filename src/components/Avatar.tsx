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
import { ModeToggle } from './toggleTheme'
import { useIsMobile } from '@/hooks/useMobile'

function AvatarComponent() {


	return (
		<div className='flex'>
			{typeof window !== 'undefined' && !useIsMobile() && <ModeToggle />}
			<Dialog>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className='ml-4'>
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link href="/home/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>

						<DialogTrigger asChild>
							<DropdownMenuItem>Settings</DropdownMenuItem>
						</DialogTrigger>
						<DropdownMenuSeparator />
						<SigninButton />
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
		</div>
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