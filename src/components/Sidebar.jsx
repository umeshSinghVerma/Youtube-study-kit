import { useContext } from "react"
import { Button } from "./ui/button.jsx"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/Sheet.jsx"
import { MenuIcon } from "lucide-react"
import { SearchContext } from "../context/SearchContext.js"

export default function Sidebar() {
    const { UserData, updateCurrentSearch } = useContext(SearchContext);
    const videos = Object.keys(UserData).map((key) => {
        return {
            id: key,
            heading: UserData[key].heading
        }
    })
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <span className='text-white flex items-center rounded-full cursor-pointer hover:bg-[#ffffff1a] w-10 h-10 p-2 justify-center mt-1'>
                        <MenuIcon height={24} width={24} />
                    </span>
                </SheetTrigger>
                <SheetContent side={"left"}>
                    <SheetHeader className="border-b pb-2">
                        <SheetTitle className="hidden">Title</SheetTitle>
                        <div className='flex gap-2'>
                            <SheetClose asChild>
                                <span className='text-white flex items-center rounded-full cursor-pointer hover:bg-[#ffffff1a] w-10 h-10 p-2 justify-center mt-1'>
                                    <MenuIcon height={24} width={24} />
                                </span>
                            </SheetClose>
                            <a target='_blank' href='https://Youtube Study Kit.com' className='flex text-white items-center justify-center gap-1'>
                                <img src="/projectLogo.png" alt="" width={30} />
                                <p style={{ fontFamily: "Oswald" }} className='text-xl'>YouTube Study Kit</p>
                            </a>
                            <SheetDescription className="hidden">
                                Make changes to your profile here. Click save when you're done.
                            </SheetDescription>
                        </div>
                    </SheetHeader>
                    <div className="h-full overflow-y-auto my-3 pl-2">
                        <div
                            className='overflow-hidden mb-3 font-semibold w-full overflow-ellipsis whitespace-nowrap'>
                            Recent
                        </div>
                        <div className="flex flex-col">
                            {videos.map((videoData, key) => {
                                return (
                                    <SheetClose asChild>
                                        <div
                                            key={key}
                                            onClick={() => updateCurrentSearch(videoData.id)}
                                            className='overflow-hidden hover:bg-[#ffffff14] p-2 px-2 cursor-pointer rounded-md text-sm w-full overflow-ellipsis whitespace-nowrap'>
                                            {videoData.heading}
                                        </div>
                                    </SheetClose>
                                )
                            })}

                        </div>

                    </div>

                </SheetContent>
            </Sheet>
        </div>
    )
}
