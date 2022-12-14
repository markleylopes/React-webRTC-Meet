
import PropTypes from "prop-types"

const styles = {
	wrapper: { display: "inline-block", position: "relative", width: "50%", height: "400px", overflow: "hidden" },
	backgroundVideo: {
		position: "absolute",
		top: "-6%",
		left: "-6%",
		zIndex: -1,
		objectFit: "fill",
		filter: "blur(100px) brightness(1.8)"
	}
}

export function VideoStream({ stream, isRemote }) {
	const getStream = (audio) => {
		if (audio && stream) {
			audio.srcObject = stream
		}
	}

	return (
		<div style={styles.wrapper}>
			<video
				style={{
					boxSizing: "border-box",
					border: `solid 8px ${isRemote ? "#ff4a4a" : "#4949ff"}`,
					background: stream ? "transparent" : isRemote ? "rgb(56 0 0)" : "rgb(1 1 68)"
				}}
				autoPlay
				height="400px"
				width="100%"
				ref={getStream}
			/>
			<video
				width="106%"
				height="106%"
				autoPlay
				muted
				style={styles.backgroundVideo}
				ref={getStream}
			/>
		</div>
	)
}

VideoStream.propTypes = {
	stream: PropTypes.oneOfType([undefined, PropTypes.srcObject, PropTypes.stream]),
	isRemote: PropTypes.bool
}