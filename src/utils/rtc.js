/* eslint-disable no-console */
export function registerPeerConnectionListeners(peerConnection) {
	peerConnection.current.addEventListener("icegatheringstatechange", () => {
		console.log(
			`ICE gathering state changed: ${peerConnection.current.iceGatheringState}`,
		)
	})

	peerConnection.current.addEventListener("connectionstatechange", () => {
		console.log(`Connection state change: ${peerConnection.current.connectionState}`)
	})

	peerConnection.current.addEventListener("signalingstatechange", () => {
		console.log(`Signaling state change: ${peerConnection.current.signalingState}`)
	})

	peerConnection.current.addEventListener("iceconnectionstatechange ", () => {
		console.log(
			`ICE connection state change: ${peerConnection.current.iceConnectionState}`,
		)
	})
}
