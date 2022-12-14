import { useMediaStream } from "../../hooks/useMediaSt"
import { useRoom } from "../../hooks/useRoom"

export function VideoCallControls() {
	const { openUserMedia, toggleAudio, toggleVideo } = useMediaStream()
	const {
		enterRoom, closeRoom, setRoomId, roomId,
	} = useRoom()

	return (
		<>
			<button type="button" onClick={openUserMedia}>Habilitar Vídeo</button>
			<input
				type="text"
				value={roomId}
				onChange={({ target }) => setRoomId(target.value)}
			/>
			<input type="button" value="Toogle Audio" onClick={toggleAudio} />
			<input type="button" value="Toogle Video" onClick={toggleVideo} />
			<input type="button" value="Desligar" onClick={closeRoom} />

			<button type="button" onClick={enterRoom}>Criar / Entrar em uma sala</button>
		</>
	)
}
