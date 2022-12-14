import { VideoChat } from "./pages/VideoChat"
import { VideoStreamProvider } from "./context/videoStream"

export default function App() {
	return (
		<div className="App">
			<VideoStreamProvider>
				<VideoChat />
			</VideoStreamProvider>
		</div>
	)
}
