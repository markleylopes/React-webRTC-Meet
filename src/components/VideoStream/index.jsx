
import PropTypes from "prop-types"

export function VideoStream({ stream, isRemote }) {
	return (
		<video
			style={{
				border: `solid 8px ${isRemote ? "red" : "blue"}`,
				borderRadius: "4px",
				boxSizing: "border-box",

				display: "inline-block",
			}}
			width="50%"
			autoPlay
			ref={(audio) => {
				if (audio && stream) {
					audio.srcObject = stream
				}
			}}
		/>
	)
}

VideoStream.propTypes = {
	stream: PropTypes.oneOfType([undefined, PropTypes.srcObject, PropTypes.stream]),
	isRemote: PropTypes.bool
}