import {
	createContext,
	useState,
	useContext,
	useRef,
	useMemo,
} from "react"
import { stunServerconfiguration } from "../../constants"

const VideoStreamContext = createContext()

// eslint-disable-next-line react/prop-types
export function VideoStreamProvider({ children }) {
	const peerConnection = useRef(new RTCPeerConnection(stunServerconfiguration))
	const [roomId, setRoomId] = useState()
	const [localStream, setLocalStream] = useState()
	const [remoteStream, setRemoteStream] = useState(new MediaStream())

	const values = useMemo(
		() => ({
			roomId,
			localStream,
			remoteStream,
			peerConnection,
			setRoomId,
			setLocalStream,
			setRemoteStream,
		}),
		[roomId, localStream, remoteStream, peerConnection],
	)

	return (
		<VideoStreamContext.Provider value={values}>
			{children}
		</VideoStreamContext.Provider>
	)
}

export function useVideoStreamContext() {
	const context = useContext(VideoStreamContext)
	return context
}
