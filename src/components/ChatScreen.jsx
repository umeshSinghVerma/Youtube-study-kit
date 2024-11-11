import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tab"
import Chat from './ChatComponents/Chat'

export default function ChatScreen() {
    return (
        <div className='flex text-white px-5 h-full'>
            <Tabs defaultValue="Chat" className="w-full flex flex-col">
                <TabsList>
                    <TabsTrigger value="Chat">Chat</TabsTrigger>
                    <TabsTrigger value="Flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="Summary">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="Chat"><Chat/></TabsContent>
                <TabsContent value="Flashcards">Change your password here.</TabsContent>
                <TabsContent value="Summary">Summary Section</TabsContent>
            </Tabs>
        </div>
    )
}
