import { useRoom } from "../../hooks/useRoom"
import { VideoStream } from "../../components/VideoStream"
import { VideoCallControls } from "../../components/VideoCallControls"

export function VideoChat() {
	const { localStream, remoteStream } = useRoom()

	return (
		<>
			<VideoStream stream={localStream} />
			<VideoStream isRemote stream={remoteStream} />
			<VideoCallControls />
		</>
	)
}
