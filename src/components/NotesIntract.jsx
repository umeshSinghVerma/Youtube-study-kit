import React, { useContext, useEffect, useState } from 'react';
import { CircleArrowRight, ImagePlus, ImagePlusIcon, Link, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Button } from './ui/button';
import { SearchContext } from '../context/SearchContext';
import NoSearchComponent from './NoSearchComponent';

export default function NotesIntract() {
  const { currentSearch, UserData, loading } = useContext(SearchContext);
  const [videoData, setVideoData] = useState(null);
  const [snapShotInfo, setSnapShotInfo] = useState(null);
  const [editedText, setEditedText] = useState(null);


  useEffect(() => {
    if (UserData[currentSearch]) {
      setVideoData(UserData[currentSearch]);
      if (UserData[currentSearch].data.length > 0) {
        setSnapShotInfo({ id: 0, text: videoData?.data[0]?.imgText || "" });
        setEditedText(videoData?.data[0]?.imgText || "");
      } else {
        setSnapShotInfo({ id: -1, text: "" });
        setEditedText("");
      }
    } else {
      setVideoData(null);
    }
  }, [currentSearch])

  useEffect(() => {
    setEditedText(videoData?.data[snapShotInfo.id]?.imgText || "");
  }, [snapShotInfo])


  if (loading || videoData == null) {
    return (
      <div className='flex flex-col text-white items-center h-full pt-20 gap-3'>
        <NoSearchComponent />
        <div className="flex flex-col items-center justify-center text-center space-y-2 p-4 bg-[#ffffff14] rounded-md shadow-md">
          <p className="text-lg font-semibold text-gray-100">Try searching to get started</p>
          <p className="text-sm text-gray-400">
            It looks like the notes you're searching for haven't been taken yet. Kindly start by taking notes from the YouTube video.
          </p>
        </div>

      </div>
    )
  }

  const handleSnapshotChange = (direction) => {
    setSnapShotInfo((prev) => {
      const newId = prev.id + direction;
      if (newId >= 0 && newId < videoData.data.length) {
        const newText = videoData.data[newId].imgText;
        setEditedText(newText);
        return { id: newId, text: newText };
      }
      return prev;
    });
  };

  const handleUpdate = () => {
    videoData.data[snapShotInfo.id].imgText = editedText;
    setSnapShotInfo((prev) => ({ ...prev, text: editedText }));
  };

  const handleDelete = () => {
    UserData[currentSearch].data.splice(snapShotInfo.id, 1);
    setSnapShotInfo((prev) => {
      if (UserData[currentSearch].data.length == 0) {
        return { id: -1, text: '' }
      }
      if (prev.id == 0 && UserData[currentSearch].data.length != 0) {
        return { id: 0, text: videoData.data[0].imgText + "" };
      }
      return { id: prev.id - 1, text: videoData.data[prev.id - 1].imgText }
    })

  }




  return (
    <div className='text-white flex flex-col h-full mx-2'>
      {
        snapShotInfo.id != -1 ?
          (
            <img src={videoData.data[snapShotInfo.id].imgUrl} alt={videoData.data[snapShotInfo.id].imgText} className='rounded-md' />
          )
          :
          (
            <div className='text-lg text-gray-400 border rounded-2xl flex-grow-[3] p-2 border-[#2f2f2f] flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center gap-1 cursor-pointer'>
                <ImagePlus />
                <p className='text-sm'>Add new notes</p>
              </div>
            </div>
          )
      }

      {/* Title and Controls */}

      <div className='flex justify-between items-center'>
        <div className='flex items-center justify-center gap-5'>
          <p
            className='overflow-hidden overflow-ellipsis whitespace-nowrap w-fit max-w-[500px]'
            style={{ fontFamily: `"Roboto","Arial",sans-serif`, fontSize: "1.20rem", lineHeight: "2.8rem", fontWeight: "700" }}>
            {videoData.heading}
          </p>
          {snapShotInfo.id >= 0 && <div className='flex gap-2'>
            <div className='hover:bg-[#5a5a5a45] p-2 rounded-full cursor-pointer'>
              <Link height={20} width={20} />
            </div>
            <div>
              <Dialog>
                <DialogTrigger>
                  <div className='hover:bg-[#5a5a5a45] p-2 rounded-full cursor-pointer'>
                    <Trash2 height={20} width={20} />
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-black text-white">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete the snapshot along with its data.
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-800">Delete</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>}
        </div>

        {snapShotInfo.id >= 0 && <div className='flex gap-2'>
          <button
            className='hover:text-white text-[#ffffffbe] active:scale-95'
            onClick={() => handleSnapshotChange(-1)}>
            <CircleArrowRight style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            className='hover:text-white text-[#ffffffbe] active:scale-95'
            onClick={() => handleSnapshotChange(1)}>
            <CircleArrowRight />
          </button>
        </div>}
      </div>

      {/* Description */}
      <div className='border border-[#2f2f2f] w-full mb-2 rounded-2xl flex-grow p-2 flex flex-col gap-2'>
        <textarea
          type="text"
          placeholder='Description'
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className='w-full h-0 flex-grow bg-transparent outline-none p-2 resize-none'
        />
        {editedText !== snapShotInfo.text && snapShotInfo.id >= 0 && (
          <button
            className='text-white font-semibold text-sm flex bg-[#ffffff27] items-center justify-center rounded-lg ml-auto h-10 w-[80px]'
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
}
