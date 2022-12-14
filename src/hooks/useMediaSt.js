import { useState } from "react"
import { useVideoStreamContext } from "../context/videoStream"

export const useMediaStream = () => {
	const [audioEnabled, setAudioEnabled] = useState(true)
	const [videoEnabled, setVideoEnabled] = useState(true)

	const {
		localStream,
		setLocalStream,
		setRemoteStream,
	} = useVideoStreamContext()

	const toggleAudio = () => {
		setAudioEnabled(v => !v)
		if (localStream?.getAudioTracks()?.[0]) {
			localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled
		}
	}

	const toggleVideo = () => {
		setVideoEnabled(v => !v)
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
		audioEnabled,
		videoEnabled,
		openUserMedia,
		toggleAudio,
		toggleVideo,
		localStream,
	}
}
