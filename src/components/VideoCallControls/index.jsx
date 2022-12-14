import { useRoom } from "../../hooks/useRoom"
import { useMediaStream } from "../../hooks/useMediaSt"
import { Microphone, MicrophoneSlash, PhoneSlash, VideoCamera, VideoCameraSlash } from "phosphor-react"

const styles = {
	button: {
		padding: 0,
		font: "inherit",
		cursor: "pointer",
		outline: "inherit",
		borderRadius: "4px",
		border: "solid 1px #9b9b9b",
	},
	iconButton: {
		padding: 0,
		font: "inherit",
		height: "42px",
		width: "42px",
		cursor: "pointer",
		display: "flex",
		outline: "inherit",
		alignItems: "center",
		borderRadius: "4px",
		border: "solid 1px #9b9b9b",
		justifyContent: "center",

	},

	wrapper: { display: "flex", gap: "8px", justifyContent: "center", padding: "16px 0" }
}

export function VideoCallControls() {
	const { audioEnabled, videoEnabled, openUserMedia, toggleAudio, toggleVideo } = useMediaStream()
	const {
		enterRoom, closeRoom, setRoomId, roomId,
	} = useRoom()

	return (
		<div style={styles.wrapper}>
			<button type="button" onClick={openUserMedia}>Habilitar Vídeo</button>
			<input
				type="text"
				value={roomId}
				style={styles.button}
				onChange={({ target }) => setRoomId(target.value)}
			/>
			<button type="button" onClick={enterRoom}>Criar / Entrar em uma sala</button>
			<button style={styles.iconButton} type="button" onClick={toggleAudio}>
				{audioEnabled ? <Microphone size="20" /> : <MicrophoneSlash size="20" />}
			</button>
			<button style={styles.iconButton} type="button" value="Toogle Video" onClick={toggleVideo}>
				{videoEnabled ? <VideoCamera size="20" /> : <VideoCameraSlash size="20" />}
			</button>
			<button style={styles.iconButton} type="button" value="Desligar" onClick={closeRoom}>
				<PhoneSlash size="20" />
			</button>

		</div>
	)
}
