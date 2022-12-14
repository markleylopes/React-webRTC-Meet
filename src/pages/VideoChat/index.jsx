import { useRoom } from "../../hooks/useRoom"
import { VideoStream } from "../../components/VideoStream"
import { VideoCallControls } from "../../components/VideoCallControls"

export function VideoChat() {
	const { localStream, remoteStream } = useRoom()

	return (
		<>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
				<VideoStream stream={localStream} />
				<VideoStream isRemote stream={remoteStream} />
			</div>
			<VideoCallControls />
		</>
	)
}
