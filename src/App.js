/* global chrome */
import './App.css';
import { Page, Text, View, Document, StyleSheet, Image, Link, PDFViewer, Font, Line, PDFDownloadLink, } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Oswald from './fonts/Oswald.ttf'
import { Expand } from 'lucide-react';
import StartingScreen from './StartingScreen';
import { getPlaylistVideoList } from './lib/getPlaylistVideoList';

Font.register({
  family: 'Oswald',
  src: Oswald
});
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 50,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 38,
    left: 35,
    textAlign: 'left',
    color: 'grey',
  },
  branding: {
    position: "absolute",
    width: "200px",
    fontSize: 12,
    bottom: 30,
    right: 35,
    textAlign: 'right',
    color: 'grey',
  }
});
function MYDocument({ videoData }) {
  if (videoData) {
    return (
      <Document>
        <Page size="LEGAL" style={styles.body}>
          <View>
            <Text style={styles.title}>{videoData.heading}</Text>
            <Line />
            {
              videoData.data.map((video) => {
                return (
                  <>
                    <Link target="_blank" href={video.ytLink}>
                      <Image src={video.imgUrl} style={styles.image} />
                    </Link>
                    <Text style={styles.text}>{video.imgText}</Text>
                  </>
                )
              })
            }
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
          <View style={styles.branding} fixed>
            <Image
              style={{ height: "20px", bottom: "3px", right: "0px", position: "absolute" }}
              src="/projectLogo.png"
            />
            <Link target="_blank" href="https://youtube-study-kit.vercel.app/" style={{ height: "20px", bottom: "0", right: "30px", position: "absolute" }}>Created Using Youtube Study Kit</Link>
          </View>
        </Page>
      </Document>
    )
  } else {
    return null
  }
}
function CompleteListDocument({ completeData }) {
  const userData = completeData.userData;
  const playlistVideos = completeData.PlaylistVideos;
  const availableVideos = playlistVideos.filter((video) => userData.hasOwnProperty(video))
  if (availableVideos) {
    return (
      <Document>
        {availableVideos.map((videoId) => {
          const title = userData[videoId].heading;
          const ImagesData = userData[videoId].data;
          return (
            <Page size="LEGAL" style={styles.body}>
              <View>
                <Text style={styles.title}>{title}</Text>
                {
                  ImagesData.map((image) => {
                    return (
                      <>
                        <Link target="_blank" href={image.ytLink}>
                          <Image src={image.imgUrl} style={styles.image} />
                        </Link>
                        <Text style={styles.text}>{image.imgText}</Text>
                      </>
                    )
                  })
                }
              </View>
              <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
              )} fixed />
              <View style={styles.branding} fixed>
                <Image
                  style={{ height: "20px", bottom: "3px", right: "0px", position: "absolute" }}
                  src="/projectLogo.png"
                />
                <Link target="_blank" href="https://youtube-study-kit.vercel.app/" style={{ height: "20px", bottom: "0", right: "30px", position: "absolute" }}>Created Using Youtube Study Kit</Link>
              </View>
            </Page>
          )
        })}
      </Document>)
  } else {
    return null;
  }
}
const Header = ({ activeTab, setActiveTab, videoId, videoData, isList }) => {
  console.log("this is videoId", videoId);
  const title = videoData?.heading || "Youtube Study Kit";
  return (
    <div className='bg-[#323639] flex items-center justify-between'>
      <div className='flex  items-center'>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isList={isList} />
        <p style={{ color: "#f1f1f1", textOverflow: "ellipsis", overflow: 'hidden', whiteSpace: 'nowrap' }} className='mb-0.5 text-sm max-w-[200px]'>{title}</p>
      </div>

      {<div className='flex gap-2 mx-2 mb-[-2px]'>
        <button
          onClick={() => {
            chrome.runtime.sendMessage({ action: "create_tab", url: `index.html#/intract${(videoId && videoData) ? `?videoId=${videoId}` : ""}` });
          }}
          className="text-white h-[32px] w-[32px] mb-[3px]  rounded-full hover:bg-[#ffffff16] flex items-center justify-center"
        >
          <Expand height={16} width={16} />
        </button>
        {videoData && videoId && <PDFDownloadLink document={<MYDocument videoData={videoData} />} fileName={`${title}.pdf`}>
          {({ loading }) => (!loading &&
            <button className='h-[32px] w-[32px] mr-2  rounded-full hover:bg-[#ffffff16] flex items-center justify-center'>
              <img src="/download.svg" alt="download" title='download' />
            </button>)
          }
        </PDFDownloadLink>}
      </div>}
    </div>
  )
}
const CompleteListHeader = ({ activeTab, setActiveTab, completeData }) => {
  const PlayListTitle = completeData.PlayListTitle;
  const userData = completeData.userData;
  const playlistVideos = completeData.PlaylistVideos;
  const availableVideos = playlistVideos.filter((video) => userData.hasOwnProperty(video))
  return (
    <div className='bg-[#323639] flex items-center justify-between'>
      <div className='flex  items-center'>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isList={completeData.list} />
        <p style={{ color: "#f1f1f1", textOverflow: "ellipsis", overflow: 'hidden', whiteSpace: 'nowrap' }} className='mb-0.5 text-sm max-w-[280px]'>{PlayListTitle}</p>
      </div>
      <div>
        {availableVideos.length > 0 && <PDFDownloadLink document={<CompleteListDocument completeData={completeData} />} fileName={`${PlayListTitle}.pdf`}>
          {({ loading }) => (!loading &&
            <button className='h-[32px] w-[32px] mr-2  rounded-full hover:bg-[#ffffff16] flex items-center justify-center'>
              <img src="/download.svg" alt="download" title='download' />
            </button>)
          }
        </PDFDownloadLink>}
      </div>
    </div>
  )
}
function App() {
  const [activeTab, setActiveTab] = useState("pdf");
  const [completeData, setCompleteData] = useState({
    list: null,
    currentVideo: null,
    userData: {},
    PlaylistVideos: [],
    PlayListTitle: null
  });
  const [notYoutube, setNotYoutube] = useState(false);
  useEffect(() => {
    getVideoData();
  }, [])
  async function getVideoData() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (notYoutube) {
          setNotYoutube(false);
        }
        const pageUrl = tabs[0].url;
        if (pageUrl.includes("youtube.com/watch")) {
          const queryParameters = pageUrl.split("?")[1];
          const urlParameters = new URLSearchParams(queryParameters);
          const videoId = urlParameters.get("v");
          const ListId = urlParameters.get('list');
          await chrome.storage.local.get("userData").then(async (result) => {
            console.log("this is the userData", result.userData);
            if (result.userData && videoId) {
              const userData = result.userData;
              if (ListId) {
                const data = await getPlaylistVideoList(ListId);
                console.log('this is the data I want ', data);
                if (data) {
                  setCompleteData({
                    list: ListId,
                    currentVideo: videoId,
                    userData: userData,
                    PlaylistVideos: data.videoIds,
                    PlayListTitle: data.playlistTitle
                  })
                }
              }
              else {
                setCompleteData({
                  list: null,
                  currentVideo: videoId,
                  userData: userData,
                  PlaylistVideos: [],
                  PlayListTitle: ""
                })
              }
            }
          });
        } else {
          setActiveTab('Not Youtube')
        }
      });
    } catch (error) {
      console.log("Outsides the extension context");
    }
  }


  switch (activeTab) {
    case 'pdf':
      console.log("Video Id ", completeData.videoId)
      return (
        <div className='flex flex-col w-full bg-[#525659] h-screen'>
          <div className='sticky top-0'>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} videoId={completeData.currentVideo} isList={completeData.list} videoData={completeData.userData[completeData.currentVideo]} />
          </div>
          {completeData.userData[completeData.currentVideo] && <PDFViewer showToolbar={false} height={"100%"} width={"100%"}>
            <MYDocument videoData={completeData.userData[completeData.currentVideo]} />
          </PDFViewer>}
        </div>
      )

    case "list":
      return (
        <div className='flex flex-col w-full bg-[#525659] h-screen'>
          <div className='sticky top-0'>
            <CompleteListHeader activeTab={activeTab} setActiveTab={setActiveTab} completeData={completeData} />
          </div>
          <PDFViewer showToolbar={false} height={"100%"} width={"100%"}>
            <CompleteListDocument completeData={completeData} />
          </PDFViewer>
        </div>
      )

    default:
      return (
        <StartingScreen notYoutube={true} />
      )
  }
}

export default App;