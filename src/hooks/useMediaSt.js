import { useVideoStreamContext } from "../context/videoStream"

export const useMediaStream = () => {
	const {
		localStream,
		setLocalStream,
		setRemoteStream,
	} = useVideoStreamContext()

	const toggleAudio = () => {
		if (localStream?.getAudioTracks()?.[0]) {
			localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled
		}
	}

	const toggleVideo = () => {
		if (localStream?.getVideoTracks()?.[0]) {
			localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled
		}
	}

	const openUserMedia = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(
				{ video: true, audio: true },
			)

			setLocalStream(stream)
			setRemoteStream(new MediaStream())
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("error: ", error)
		}
	}

	return {
		openUserMedia,
		toggleAudio,
		toggleVideo,
		localStream,
	}
}
