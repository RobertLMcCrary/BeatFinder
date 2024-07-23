"use client"
import { useState, useEffect } from "react"

//nextui
import {
    Navbar,
    NavbarItem,
    NavbarContent,
    NavbarBrand,
    Button,
    Link,
    Image,
    NavbarMenuToggle, NavbarMenu, NavbarMenuItem
} from "@nextui-org/react"

function Nav() {

    return (
        <Navbar maxWidth='full' className='h-[100px] bg-white border-solid border-gray-200 border-b-[1px] justify-between'>
            <NavbarContent className='w-[100vw] items-center justify-between'>
                <NavbarContent justify='start'>
                    <NavbarBrand>
                        <h1 className='text-3xl font-bold text-black'>BeatFinder</h1>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent justify='end' className='flex gap-[1vw]'>
                    <NavbarItem>
                        <Link href='/' className='text-black text-xl transition duration-500 hover:text-gray-500'>Spotify</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href='/about' className='text-black text-xl transition duration-500 hover:text-gray-500'>Apple</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href='/profile' className='text-black text-xl transition duration-500 hover:text-gray-500'>SoundCloud</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href='/profile' className='text-black text-xl transition duration-500 hover:text-gray-500'>Amazon</Link>
                    </NavbarItem>
                </NavbarContent>
            </NavbarContent>
        </Navbar>
    )
}

export default Nav